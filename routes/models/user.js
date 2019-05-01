const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  phone: Number,
  zipCode: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

//Authenticate
UserSchema.statics.authenticate = function(email, password, callback) {
  User.findOne({ email: email }).exec(function(error, user) {
    if (error) {
      return callback(error);
    } else if (!user) {
      var err = new Error("User not found.");
      err.status = 401;
      return callback(err);
    }
    bcrypt.compare(password, user.password, function(error, result) {
      if (result === true) {
        return callback(null, user);
      } else {
        return callback();
      }
    });
  });
};

//hash password
UserSchema.pre("save", function(next) {
  var user = this;
  bcrypt.hash(user.password, 10, function(err, hash) {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  });
});

const User = mongoose.model("User", UserSchema);

module.exports.User = User;
