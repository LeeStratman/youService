const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, minlength: 2, trim: true },
    email: {
      type: String,
      required: true,
      minlength: 5,
      trim: true,
      lowercase: true,
      unique: true,
    },
    password: { type: String, required: true, minlength: 8, trim: true },
    phone: { type: String, minlength: 6, required: true },
    refresh_token: {
      token: {
        type: String,
        default: "",
      },
      added_at: {
        type: Date,
        required: true,
        default: Date.now(),
      },
    },
    is_verified: {
      type: Boolean,
      required: true,
      default: false,
    },
  },

  { timestamps: true }
);

userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
    },
    process.env.AUTH_SECRET,
    {
      expiresIn: "30m",
    }
  );
};

const User = mongoose.model("User", userSchema);

module.exports = User;
