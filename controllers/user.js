const User  = require('../models/user');
const jwt = require('jsonwebtoken');
const { response } = require('../app');
// console.log("user controller")

exports.signup = async (req, res, next) => {
    console.log("req", req.body);
    console.log("coucou");
    try{
      const user = await User.create({...req.body});
      res.status(201).json({message: "Utilisateur créé"});
    } catch (err) {
      console.log("ERROR ", err);
      res.status(500).json({message: "Utilisateur non créé"});
    }
};

exports.login = async (req, res, next) => {
    console.log("req.body", req.body);
  const user = await User.findOne({ where:  { email: req.body.email } });
  if(user == null){
    res.status(404).json({message: "wrong username"});
  }
  if(user.getDataValue('password') == req.body.password){
      console.log("CONNECTED");
      res.status(200).json({
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          admin: user.admin,
          profilPic: user.profilPic
        },
        token: jwt.sign(
          { userId: user.id },
          'USER_SECRET_TOKEN',
          { expiresIn: '24h' }
        )
      });
  } else {
      console.log("NOT CONNECTED");
      res.status(500).json({message: "Mot de passe incorrect"});
  }
};

exports.autoLogin = async (req, res, next) => {
  console.log("autoLogin ", req.body);
  const user = await User.findOne({ where:  { id: req.body.UserId } });
  if(user == null){
    res.status(404).json({message: "An error occured"});
  } 
  if( req.body.auto ){
    console.log("CONNECTED");
    res.status(200).json({
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        admin: user.admin,
        profilPic: user.profilPic
      },
      token: jwt.sign(
        { userId: user.id },
        'USER_SECRET_TOKEN',
        { expiresIn: '24h' }
      )
    });
  } else {
    console.log("NOT CONNECTED");
    res.status(500).json({message: "An error occured"});
}
};

exports.getOne = async (userId) => {
  console.log("getOne user ", userId);
  const user = await User.findOne({ where: {id: userId}});
  if(user != undefined){
    res.status(200).json({
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        admin: user.admin,
        profilPic: user.profilPic
      },
      token: jwt.sign(
        { userId: user.id },
        'USER_SECRET_TOKEN',
        { expiresIn: '24h' }
      )
    });
  } else {
    console.log("user not found");
  }
};