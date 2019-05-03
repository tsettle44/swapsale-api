const express = require("express");
const router = express.Router();
const Item = require("../models/item").Item;
const User = require("../models/user").User;

//GET all items
router.get("/", (req, res) => {
  Item.find({}, (err, item) => {
    if (err) throw err;
    const items = [];

    item.forEach(i => {
      items.unshift(i);
    });

    res.send(items);
  });
});

//GET specific item
router.get("/:id", (req, res) => {
  Item.find({ _id: req.params.id }, (err, item) => {
    if (err) throw err;
    res.send(item);
  });
});

//GET searched items
router.get("/search/:value", (req, res) => {
  Item.find({ name: req.params.value }, (err, item) => {
    if (err) throw err;
    const items = [];

    item.forEach(i => {
      items.unshift(i);
    });

    res.send(items);
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
      updatedUser.items.push(item);

      User.updateOne({ _id: req.body.userId }, updatedUser, (err, user) => {
        if (err) throw err;
        res.status(204).send();
      });
    });
  });
});

module.exports = router;
