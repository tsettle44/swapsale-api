const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");

mongoose.connect(
  process.env.DATABASE_URL,
  {
    useNewUrlParser: true
  },
  err => {
    if (err) throw err;
    console.log("Connection Successful Boi");
  }
);

//Middleware
app.use(bodyParser.json());
app.use(cors());

//Users
const users = require("./routes/api/users");
app.use("/api/users", users);

// //Items
// const items = require("./routes/api/items");
// app.use("/api/items", items);

// //Reviews
// const reviews = require("./routes/api/reviews");
// app.use("/api/reviews", reviews);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
