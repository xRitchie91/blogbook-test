// set up imports
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");
const bcrypt = require("bcrypt");

//Set up User model
class User extends Model {
  //check passwords
  checkPassword(loginPw) {
      // set up method to run on instance data (per user) to check password
    return bcrypt.compareSync(loginPw, this.password); 
  }
}

// create fields/columns for User model
User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      // Validate if it is a valid email
      validate: { isEmail: true },
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      //make sure password has to be at least 5 char
      validate: { len: [5] },
    },
  },

  {
    hooks: {
      //set up beforeCreate lifecycle hooks functionality

      async beforeCreate(newUserData) {
        newUserData.password = await bcrypt.hash(newUserData.password, 10);
        return newUserData;
      },
      //when we send in an update command
      async beforeUpdate(updatedUserData) {
        updatedUserData.password = await bcrypt.hash(
          updatedUserData.password,
          10
        );
        return updatedUserData;
      },
    }, //for bcrypt
    // pass in our imported sequelize connection (the direct connection to our database)
    sequelize,
    // don't automatically create createdAt/updatedAt timestamp fields
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: "user",
  }
);

module.exports = User;