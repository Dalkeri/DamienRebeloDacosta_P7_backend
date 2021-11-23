const { User } = require('../models')
const Sequelize = require('sequelize');
const Op = Sequelize.Op

const jwt = require('jsonwebtoken');
const { response } = require('../app');
// console.log("user controller")

exports.signup = async (req, res, next) => {
    console.log("req", req.body);
    console.log("coucou");
    try{
      const user = await User.create({...req.body});
      console.log({user});
      // token: jwt.sign(
      //   { userId: user.id },
      //   'USER_SECRET_TOKEN',
      //   { expiresIn: '24h' }
      // )
      // res.status(201).json({message: "Utilisateur créé"});
      console.log(user.dataValues.id);
      return res.status(201).json({
        // TODO: create function to do that
        user: { 
          id: user.dataValues.id,
          firstName: user.dataValues.firstName,
          lastName: user.dataValues.lastName,
          email: user.dataValues.email,
          admin: user.vadmin,
          profilPic: user.dataValues.profilPic
        },
        token: jwt.sign(
          { userId: user.id },
          'USER_SECRET_TOKEN',
          { expiresIn: '24h' }
        )
      });
    } catch (err) {
      console.log("ERROR ");
      console.log(err.errors);
      if(err.errors[0].validatorKey == "not_unique") {
        return res.status(500).json({message: "Les emails doivent être unique"});
      }
      return res.status(500).json({message: "Il y a eu une erreur lors de la création"});
    }
};

exports.login = async (req, res, next) => {
  console.log("req.body", req.body);
  // console.log("USER", User);
  const user = await User.findOne({ where:  { email: req.body.email } });
  console.log("USER : ", user);
  if(user == null){
    return res.status(500).json({message: "Informations de connexions incorrectes (user)"});
  }
  if(user.getDataValue('password') == req.body.password){
      console.log("CONNECTED");
      return res.status(200).json({
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
  }

  console.log("NOT CONNECTED");
  return res.status(500).json({message: "Informations de connexions incorrectes (mdp)"});
  
};

exports.autoLogin = async (req, res, next) => {
  console.log("autoLogin ", req.body);
  // console.log("decoded ", decodedToken);
  const user = await User.findOne({ where:  { id: req.body.userId } });
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
  // const user = await User.findOne({ where: {id: userId}});
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