const express = require("express");
const { Client } = require("pg");
const router = express.Router();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

client.connect();

//GET all users
router.get("/", (req, res) => {
  client.query("SELECT * FROM users", (err, rest) => {
    results = [];
    if (err) throw err;
    for (let row of rest.rows) {
      results.push(JSON.stringify(row));
    }
    res.send(results);
  });
});

//POST user sign-up
router.post("/sign-up", (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const phone = req.body.phone;
  const gender = req.body.gender;
  const bod = req.body.bod;
  const country = req.body.country;
  const zipCode = req.body.zipCode;
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
