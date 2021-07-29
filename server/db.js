const mongoose = require("mongoose");

const db = () => {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
    useCreateIndex: true,
  });

  if (process.env.NODE_ENV !== "production") {
    const mDB = mongoose.connection;

    mDB.on("open", () => {
      console.log("MongoDB connected");
    });

    mDB.on("error", (error) => {
      console.log(`MongoDB connection REFUSED. Error: ${error.message}`);
    });
  }
};

module.exports = db;
