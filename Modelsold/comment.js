const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require("../database");
// console.log("comment.js model");

const Comment = sequelize.define("Comment", {
    // userId: {
    //     type: DataTypes.INTEGER,
    //     allowNull: false,
    //     references: {
    //         model: 'Users',
    //         key: 'id'
    //     }
    // },
    // threadId: {
    //     type: DataTypes.INTEGER,
    //     allowNull: false,
    //     references: {
    //         model: 'Threads',
    //         key: 'id'
    //     }
    // },
    content: {
        type: DataTypes.STRING,
        allowNull: false
    },
    visible : {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
});

async function reset() {
    await Comment.sync({ force: true });
}
// reset();

module.exports = Comment;