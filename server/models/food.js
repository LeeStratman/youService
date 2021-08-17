const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  categories: [String],
});

const Food = mongoose.model("Food", foodSchema);

model.export = Food;
