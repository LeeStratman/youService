const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  categories: [String],
});

const Food = mongoose.model("Food", foodSchema);

module.exports = Food;
