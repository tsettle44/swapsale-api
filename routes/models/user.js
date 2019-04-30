const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema(
  {
    firstName: "string",
    lastName: "string",
    email: "string",
    password: "string",
    phone: "number",
    zipCode: "number"
  },
  {
    hooks: {
      beforeCreate: user => {
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(user.password, salt);
      }
    },
    instanceMethods: {
      validPassword: function(password) {
        return bcrypt.compareSync(password, this.password);
      }
    }
  }
);

// create all the defined tables in the specified database.
sequelize
  .sync()
  .then(() =>
    console.log(
      "users table has been successfully created, if one doesn't exist"
    )
  )
  .catch(error => console.log("This error occured", error));

module.exports.User = User;
