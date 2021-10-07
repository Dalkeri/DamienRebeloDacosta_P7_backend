const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database');
// console.log("user.js model");

const User = sequelize.define("User", {
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email : {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password : {
        type: DataTypes.STRING,
        allowNull: false
    },
    admin : {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    },
    profilPic : {
        type: DataTypes.STRING,
        // defaultValue: path to default pic
        allowNull: true
    }
    //ajouter "biographie"
});

async function reset() {
    await User.sync({ force: true });
}
// reset();

module.exports = User;