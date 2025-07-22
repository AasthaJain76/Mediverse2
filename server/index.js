const express = require("express");
const app = express();
const port = process.env.PORT || 8080;

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const bcrypt = require("bcrypt");

dotenv.config();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.error("MongoDB connection error:", err));

app.get("/", (req, res) => {
  res.send("MediVerse Backend is running");
});

app.listen(port, () => {
  console.log(`🚀 Server listening on port ${port}`);
});
