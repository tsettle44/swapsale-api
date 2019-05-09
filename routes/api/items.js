const express = require("express");
const router = express.Router();
const path = require("path");
const crypto = require("crypto");
const GridFsStorage = require("multer-gridfs-storage");
const multer = require("multer");
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

//Create Storage engine
const storage = new GridFsStorage({
  url: process.env.DATABASE_URL,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "images"
        };
        resolve(fileInfo);
      });
    });
  }
});

const upload = multer({ storage });

//POST new item
router.post("/", upload.single("img"), (req, res) => {
  const newItem = new Item({
    img: req.file.id,
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
