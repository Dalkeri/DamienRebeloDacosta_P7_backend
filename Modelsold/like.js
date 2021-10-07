const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require("../database");
// console.log("like.js model");

const Like = sequelize.define("Like", {
    // userId: {
    //     type: DataTypes.INTEGER,
    //     allowNull: false,
    //     references: {
    //         model: 'users',
    //         key: 'id'
    //     }
    // },
    // threadId: {
    //     type: DataTypes.INTEGER,
    //     allowNull: false,
    //     references: {
    //         model: 'threads',
    //         key: 'id'
    //     }
    // },
    visible : {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
    // commentId ?
});

async function reset() {
    await Like.sync({ force: true });
}
// reset();

module.exports = Like;