const express = require("express");
const { Client } = require("pg");
const router = express.Router();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

client.connect();

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

router.post("/", (req, res) => {
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

module.exports = router;
