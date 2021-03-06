const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const Grid = require("gridfs-stream");

const conn = mongoose.createConnection(process.env.DATABASE_URL);

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true
});

let gfs;

conn.once("open", () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("images");
  console.log("Connection Successful Boi");
});

//Middleware
app.use(bodyParser.json());
app.use(cors());

//Users
const users = require("./routes/api/users");
app.use("/api/users", users);

//Items
const items = require("./routes/api/items");
app.use("/api/items", items);

// //Reviews
// const reviews = require("./routes/api/reviews");
// app.use("/api/reviews", reviews);

// error handler
// define as the last app.use callback
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render("error", {
    title: "Error",
    message: err.message,
    error: {}
  });
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
