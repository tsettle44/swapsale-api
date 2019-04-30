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
    res.send("New User Created!");
  });
});

// app.post("/sign-up", (req, res) => {
//   const { name, email, password, phone, zipCode } = req.body;
//   const sql = `INSERT INTO users VALUES (DEFAULT, '${name}', '${email}', crypt('${password}', gen_salt('bf', 8)), ${phone}, DEFAULT, ${zipCode})`;
//   client.query(sql, (err, result) => {
//     if (err) throw err;
//     req.session.user = uuidv4();
//     res.status(201).send(`1 row inserted`);
//   });
// });

//GET user login
app.get("/log-in", (req, res) => {
  client.query(
    `SELECT * FROM users WHERE email = lower('${
      req.body.email
    }') AND password = crypt('${req.body.password}', password)`,
    (err, result) => {
      if (err) throw err;
      req.session.user = uuidv4();
      res.send(result.rows);
    }
  );
});

module.exports = app;
