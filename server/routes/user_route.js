const express = require("express");
const router = express.Router();
const { hashPassword, comparePassword } = require("../helpers/password_hash");
const { createAccessToken, createRfreshToken } = require("../helpers/jwt");
const User = require("../models/user");
const { sendMessage } = require("../helpers/twilio_api");
const {
  generateVerificationPin,
} = require("../models/verification_pin/verification_pin_model");
const pinLength = process.env.VERIIFICATION_PIN_LENGTH;

//User sign up
router.post("/sign-up", async (req, res) => {
  const { password } = req.body;
  try {
    let user = await User.find({ email: req.body.email }).lean().exec();

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

module.exports = router;
