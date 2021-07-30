const express = require("express");
const router = express.Router();
const User = require("../models/user");

//User sign up
router.post("/sign-up", async (req, res) => {
  try {
    let user = await User.find({ email: req.body.email }).lean().exec();

    if (user.length > 0) {
      return res.json({ status: "error", message: "user already exists" });
    }

    user = await User.create(req.body);

    return res.json({ status: "success", message: "account has been created" });
  } catch (error) {
    return res.json({ status: "error", message: error.message });
  }
});

module.exports = router;
