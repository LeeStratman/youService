require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const db = require("./db");
const userRoute = require("./routes/user_route");

const port = process.env.PORT || 3001;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

db();

app.use("/api/user", userRoute);

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
