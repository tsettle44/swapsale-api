const express = require("express");
const router = express.Router();
const Item = require("../models/item").Item;
const User = require("../models/user").User;

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
  const newItem = new Item({
    name: req.body.name,
    userId: req.body.userId,
    price: req.body.price,
    description: req.body.desc,
    status: req.body.status,
    zipCode: req.body.zipCode
  });

  Item.create(newItem, (err, item) => {
    if (err) throw err;
    User.findOne({ _id: req.body.userId }, (err, user) => {
      if (err) throw err;
      updatedUser = user.toObject();
      console.log(updatedUser.items);
      updatedUser.items.push(item);

      User.updateOne({ _id: req.body.userId }, updatedUser, (err, user) => {
        if (err) throw err;
        res.status(204).send();
      });
    });
  });
});

module.exports = router;
