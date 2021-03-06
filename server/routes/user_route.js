const express = require("express");
const router = express.Router();
const Joi = require("joi");
const { hashPassword, comparePassword } = require("../helpers/password_hash");
const { createAccessToken, createRfreshToken } = require("../helpers/jwt");
const User = require("../models/user/user_schema");
const { verifyUser } = require("../models/user/user_model");
const {
  generateVerificationPin,
  verifyPin,
  deleteVerificationPin,
} = require("../models/verification_pin/verification_pin_model");

//User sign up
router.post("/sign-up", async (req, res) => {
  const { error } = validateUser(req.body);

  if (error) {
    return res
      .status(400)
      .json({ status: "error", message: error.details[0].message });
  }

  const { password, email } = req.body;

  try {
    let user = await User.find({ email }).lean().exec();

    if (user.length > 0) {
      return res.json({ status: "error", message: "user already exists" });
    }

    const hashedPwd = await hashPassword(password);
    const newUserObj = { ...req.body, password: hashedPwd };

    user = await User.create(newUserObj);

    const pin = await generateVerificationPin(user);
    console.log(pin);

    return res.json({
      status: "success",
      message:
        "Account has been created. Complete account set up with verification code sent to your phone number",
    });
  } catch (error) {
    return res.json({ status: "error", message: error.message });
  }
});

// New user verification
router.patch("/verify", async (req, res) => {
  try {
    const { email, pin } = req.body;

    const result = await verifyPin(email, pin);

    if (!result._id) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid email or pin" });
    }

    const isPinValid =
      new Date() < result.created_at.setDate(result.created_at.getDate() + 1);

    if (!isPinValid) {
      // Delete pin from DB since it is expired
      deleteVerificationPin(email, pin);
      return res.status(400).json({ status: "error", message: "Expired pin" });
    }

    const verifiedUser = await verifyUser(result);

    // Delete pin from DB once pin has been used
    await deleteVerificationPin(email, pin);

    const { _id, name, phone } = verifiedUser;

    res.json({
      status: "success",
      message: "Your account has been verified",
      result: { _id, name, email, phone },
    });
  } catch (error) {
    return res.json({ status: "error", message: error.message });
  }
});

// User log in
router.post("/log-in", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email }).exec();

    if (!user) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid username or password" });
    }

    const valid = await comparePassword(user.password, req.body.password);

    if (!valid) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid username or password" });
    }

    const accessJWT = await createAccessToken(user._id, user.email);
    const refreshJWT = await createRfreshToken(user._id, user.email);

    return res.status(200).json({
      status: "success",
      message: "Successfully signed in",
      accessJWT,
      refreshJWT,
    });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
});

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    phone: Joi.string()
      .min(6)
      .pattern(/^[0-9]+$/)
      .required(),
  });

  return schema.validate(user);
}

module.exports = router;
