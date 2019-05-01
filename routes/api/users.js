const express = require("express");
const app = express();
const session = require("express-session");
const uuidv4 = require("uuid/v4");
const User = require("../models/user").User;

app.use(
  session({
    secret: "swapsale",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 600000
    }
  })
);

app.use((req, res, next) => {
  if (req.session.cookie.id && !req.session.user) {
    res.clearCookie(req.session.user);
  }
  next();
});

const sessionChecker = (req, res, next) => {
  if (req.session.user && req.session.cookie.id) {
    res.redirect("/login");
  } else {
    next();
  }
};

// route for user logout
app.get("/logout", (req, res) => {
  if (req.session.user && req.session.cookie.id) {
    res.clearCookie(req.session.user);
    res.redirect("/");
  } else {
    res.redirect("/login");
  }
});

//GET all users
app.get("/", (req, res) => {
  client.query("SELECT * FROM users", (err, rest) => {
    results = [];
    if (err) throw err;
    for (let row of rest.rows) {
      results.push(row);
    }
    res.send(results);
  });
});

//POST user sign-up
app.post("/signup", (req, res) => {
  var newUser = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    phone: req.body.phone,
    zipCode: req.body.zipCode
  });

  newUser.save(err => {
    if (err) throw err;
    res.status(201).send();
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
        req.session.userId = user._id;
        res.status(200).send();
      }
    });
  } else {
    var err = new Error("Email and password are required");
    err.status = 401;
    res.send(err);
  }
});

module.exports = app;
