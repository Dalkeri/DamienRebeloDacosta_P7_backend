const User  = require('../models/user');
const jwt = require('jsonwebtoken');
// console.log("user controller")

exports.signup = async (req, res, next) => {
    console.log("req", req.body);
    try{
      const user = await User.create({...req.body});
    } catch (err) {
      console.log("ERRORRRRRRRRRRR", err);
    }
};

exports.login = async (req, res, next) => {
    console.log("req.body", req.body);
  const user = await User.findOne({ where:  { email: req.body.email } });
  if(user.getDataValue('password') == req.body.password){
      console.log("CONNECTED");
      res.status(200).json({
        userId: user.id,
        token: jwt.sign(
          { userId: user.id },
          'USER_SECRET_TOKEN',
          { expiresIn: '24h' }
        )
      });
  } else {
      console.log("NOT CONNECTED");
  }
};

exports.getOne = async (userId) => {
  console.log("getOne user ", userId);
  const user = await User.findOne({ where: {id: userId}});
  if(user != undefined){
    return {firstName: user.firstName, lastName: user.lastName};
  } else {
    console.log("user not found");
  }
}


//ajouter la modif de son compte