const express = require('express');
const bodyParser =  require('body-parser');
// const { Sequelize, DataTypes } = require('sequelize');

const userRoutes = require('./routes/user');
const threadRoutes = require('./routes/thread');
const commentRoutes = require('./routes/comment');
require('dotenv').config();
// const likeRoutes = require('./routes/like');

// const db = require('./models/index');
// db.sequelize.sync({force:true});

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());

app.use(express.static('public'));  
app.use('/images', express.static('images')); 


app.use('/api/user', userRoutes);
app.use('/api/thread', threadRoutes);
app.use('/api/comment', commentRoutes);
// app.use('/api/like', likeRoutes);

// const associations = require('./Models/associations')

module.exports = app;