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
  client.query("SELECT * FROM reviews", (err, rest) => {
    results = [];
    if (err) throw err;
    for (let row of rest.rows) {
      results.push(JSON.stringify(row));
    }
    res.send(results);
  });
});

//POST new item
router.post("/", (req, res) => {
  const stars = req.body.stars;
  const itemId = req.body.itemId;
  const forUserId = req.body.forUserId;
  const byUserId = req.body.byUserId;
  const comment = req.body.comment;
  const sql = `INSERT INTO reviews VALUES(DEFAULT, ${stars}, '${itemId}', '${forUserId}', '${byUserId}', '${comment}', DEFAULT)`;
  client.query(sql, (err, result) => {
    if (err) throw err;
    res.status(201).send(`1 row inserted`);
  });
});

module.exports = router;
