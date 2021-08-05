const express = require("express");
const router = express.Router();
const Joi = require("joi");
const { hashPassword, comparePassword } = require("../helpers/password_hash");
const User = require("../models/user");

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

    return res.json({
      status: "success",
      message: "account has been created",
      user,
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

    return res
      .status(200)
      .json({ status: "success", message: "Successfully signed in" });
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
