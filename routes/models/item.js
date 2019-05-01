const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
  name: String,
  userId: String,
  price: Number,
  description: String,
  status: String,
  zipCode: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Item = mongoose.model("Item", ItemSchema);

module.exports.Item = Item;
