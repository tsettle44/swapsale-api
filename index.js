const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const { Client } = require("pg");

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

client.connect();

//Middleware
app.use(bodyParser.json());
app.use(cors());

app.get("/", function(req, res) {
  res.send("Hello World!");
  client.query(
    "SELECT table_schema,table_name FROM information_schema.tables;",
    (err, res) => {
      if (err) throw err;
      for (let row of res.rows) {
        console.log(JSON.stringify(row));
      }
      client.end();
    }
  );
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
