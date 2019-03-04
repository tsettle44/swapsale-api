const express = require("express");
const { Client } = require("pg");
const router = express.Router();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

client.connect();

//GET all items
router.get("/", (req, res) => {
  client.query("SELECT * FROM items", (err, rest) => {
    results = [];
    if (err) throw err;
    for (let row of rest.rows) {
      results.push(row);
    }
    res.send(results);
  });
});

//POST new item
router.post("/", (req, res) => {
  const name = req.body.name;
  const userId = req.body.userId;
  const price = req.body.price;
  const description = req.body.desc;
  const status = req.body.status;
  const zipcode = req.body.zipcode;
  const sql = `INSERT INTO items VALUES(DEFAULT, '${name}', '${userId}', ${price}, '${description}', '${status}', DEFAULT, '${zipcode}')`;
  client.query(sql, (err, result) => {
    if (err) throw err;
    res.status(201).send(`1 row inserted`);
  });
});

module.exports = router;
