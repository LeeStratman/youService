const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const pinLength = process.env.VERIIFICATION_PIN_LENGTH;

const VerificationPinSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
  },
  pin: {
    type: String,
    min: pinLength,
    max: pinLength,
  },
  email: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});

const VerificationPin = mongoose.model(
  "VerificationPin",
  VerificationPinSchema
);

module.exports = VerificationPin;
