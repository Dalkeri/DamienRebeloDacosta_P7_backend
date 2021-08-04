const {  DataTypes } = require('sequelize');
const sequelize = require("../database");
// console.log("thread.js model");

const Thread = sequelize.define("Thread", {
    // userId: {
    //     type: DataTypes.INTEGER,
    //     allowNull: false,
    //     references: {
    //         model: 'users',
    //         key: 'id'
    //     }
    // },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    content: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    contentImg : {
        type: DataTypes.STRING,
        allowNull: true
    },
    visible : {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
});

async function reset() {
    await Thread.sync({ force: true });
}
// reset();

module.exports = Thread;