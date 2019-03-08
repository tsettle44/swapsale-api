const Sequelize = require("sequelize");
const sequelize = new Sequelize(process.env.DATABASE_URL);
const bcrypt = require("bcrypt");

const User = sequelize.define(
  "user",
  {
    firstName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    phone: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    zipCode: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
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
