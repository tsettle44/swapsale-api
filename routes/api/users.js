const express = require("express");
const { Client } = require("pg");
const router = express.Router();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

client.connect();

router.get("/", (req, res) => {
  client.query(
    "SELECT table_schema,table_name FROM information_schema.tables;",
    (err, rest) => {
      results = [];
      if (err) throw err;
      for (let row of rest.rows) {
        results.push(JSON.stringify(row));
      }
      res.send(results);
      client.end();
    }
  );
});

module.exports = router;
