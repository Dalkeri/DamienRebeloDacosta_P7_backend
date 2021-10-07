const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require("../database");

const Thread = require("./thread");
const Comment = require("./comment");
const User = require('./user');

User.hasMany(Thread);
User.hasMany(Comment);

Thread.belongsTo(User);
Thread.hasMany(Comment);

Comment.belongsTo(Thread);
Comment.belongsTo(User);



console.log("associations");

async function createAll(){
    await User.sync({ force: true });
    await Thread.sync({ force: true });
    await Comment.sync({ force: true });
    // await Like.sync({ force: true });

    console.log("create all");
}
// createAll();

async function deleteAll(){
    await Comment.destroy({  });
    await Thread.destroy({  });
    await User.destroy({  });
    // await Like.sync({ force: true });

    console.log("resetAll");
}
// deleteAll();
// deleteAll et createAll pour suppr dans le bon ordre et recréer dans le bon ordre





const users = [
    {
        firstName: "Bob",
        lastName: "Dupond",
        email: "Bob@Bob.com",
        password: "bobPassword"
    },
    {
        firstName: "Sarah",
        lastName: "Durand",
        email: "Sarah@Sarah.com",
        password: "sarahPassword"
    }
];

async function createBasicUsers(){
    try{
        for(let i=0; i<users.length; i++){
            await User.create({...users[i]});
        }
    }catch (err) {
        console.log("ERROR createBasicUsers", err);
      }
}
// createBasicUsers();

const threads = [
    {
        title: "Post de Bob",
        content: "Bonjour, je suis Bob",
        UserId: 1
    },
    {
        title: "Post de Sarah",
        content: "Bonjour, je suis Sarah",
        UserId: 2
    }
];

async function createBasicThreads(){
    try{
        for(let i=0; i<threads.length; i++){
            await Thread.create({...threads[i]});
        }
    }catch (err) {
        console.log("error createBasicThreads", err);
      }
}
// createBasicThreads();


const comments = [
    {
        content: "Bonjour 2",
        UserId: 1,
        ThreadId: 2
    },
    {
        content: "Bonjour 2",
        UserId: 2,
        ThreadId: 1
    }
];

async function createBasicComments(){
    try{
        for(let i=0; i<comments.length; i++){
            await Comment.create({...comments[i]});
        }
    }catch (err) {
        console.log("error createBasicComments", err);
      }
}
// createBasicComments();

