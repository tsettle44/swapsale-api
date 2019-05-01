const express = require("express");
const app = express();
const User = require("../models/user").User;

//POST user sign-up
app.post("/signup", (req, res) => {
  const newUser = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    phone: req.body.phone,
    zipCode: req.body.zipCode
  });

  newUser.save((err, user) => {
    if (err) throw err;
    res.status(201).send(user._id);
  });
});

//GET user login
app.post("/login", (req, res, next) => {
  if (req.body.email && req.body.password) {
    User.authenticate(req.body.email, req.body.password, function(error, user) {
      if (error || !user) {
        var err = new Error("Wrong email or password");
        err.status = 401;
        res.send(err);
      } else {
        res.send(user._id);
      }
    });
  } else {
    var err = new Error("Email and password are required");
    err.status = 401;
    res.send(err);
  }
});

module.exports = app;
