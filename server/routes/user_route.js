const express = require("express");
const router = express.Router();
const { hashPassword, comparePassword } = require("../helpers/password_hash");
const { createAccessToken } = require("../helpers/jwt");
const User = require("../models/user");

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

    return res.json({
      status: "success",
      message: "account has been created",
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

    return res.status(200).json({
      status: "success",
      message: "Successfully signed in",
      accessJWT,
    });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
});

module.exports = router;
