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
    client.end();
  });
});

router.post("/", (req, res) => {
  client.query(
    "INSERT INTO users VALUES (DEFAULT, 'Tom Settle', 'tsettle44@gmail.com', 3, 'male', '03/24/1997', 'sysdate', 1, 46033)",
    (err, result) => {
      if (err) throw err;
      res.send(result.row);
      client.end();
    }
  );
});

module.exports = router;
