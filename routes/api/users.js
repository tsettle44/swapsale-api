const express = require("express");
const { Client } = require("pg");
const router = express.Router();
const session = require("express-session");

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

client.connect();

app.use(
  session({
    genid: function(req) {
      return genuuid(); // use UUIDs for session IDs
    },
    secret: "swapsale",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 600000
    }
  })
);

app.use((req, res, next) => {
  if (req.cookies.genid && !req.session.user) {
    res.clearCookie(req.session.genid);
  }
  next();
});

const sessionChecker = (req, res, next) => {
  if (req.session.user && req.cookies.genid) {
    res.redirect("/login");
  } else {
    next();
  }
};

// route for user logout
app.get("/logout", (req, res) => {
  if (req.session.user && req.cookies.genid) {
    res.clearCookie(req.session.genid);
    res.redirect("/");
  } else {
    res.redirect("/login");
  }
});

//GET all users
router.get("/", (req, res) => {
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
router.post("/sign-up", (req, res) => {
  const {
    name,
    email,
    password,
    phone,
    gender,
    bod,
    country,
    zipCode
  } = req.body;
  const sql = `INSERT INTO users VALUES (DEFAULT, '${name}', '${email}', crypt('${password}', gen_salt('bf', 8)), ${phone}, '${gender}', '${bod}', DEFAULT, ${country}, ${zipCode})`;
  client.query(sql, (err, result) => {
    if (err) throw err;
    res.status(201).send(`1 row inserted`);
  });
});

//GET user login
router.get("/log-in", (req, res) => {
  client.query(
    `SELECT * FROM users WHERE email = lower('${
      req.body.email
    }') AND password = crypt('${req.body.password}', password)`,
    (err, result) => {
      if (err) throw err;
      res.send(result.rows);
    }
  );
});

module.exports = router;
