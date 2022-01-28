const { User } = require('../models')
const Sequelize = require('sequelize');
const fs = require('fs');
const Op = Sequelize.Op

const jwt = require('jsonwebtoken');
const { response } = require('../app');
const { CONNREFUSED } = require('dns');
const res = require('express/lib/response');
const bcrypt = require('bcrypt');

exports.signup = async (req, res, next) => {
    console.log("req", req.body);

    //check mdp
    req.body.profilPic = `${req.protocol}://${req.get('host')}/images/profils/default_profil.png`; 

    let mailFormat = `^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$`;
    console.log(req.body.email);
    console.log(mailFormat);
    console.log(req.body.email.match(mailFormat));
    if( !req.body.email.match(mailFormat)){
      return res.status(401).json({message: "Le format de l'email est incorrect."});
    }
    
    try{
      
      bcrypt.hash(req.body.password, 10)
        .then( async (hash) => {                                  //TODO, see here
          req.body.password = hash;
          console.log(req.body);
          const user = await User.create({...req.body});
          return res.status(201).json({
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
              'USER_SECRET_TOKEN', //TODO in .env
              { expiresIn: '24h' }
            )
          });
        })
        .catch(error => res.status(500).json({message:" 1 Erreur lors de l'inscription."}))
     
    } catch (err) {
      console.log(err);
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
    return (500).json({message: "Mauvais email ou mot de passe."});
  }
  
  bcrypt.compare(req.body.password, user.password)
    .then( valid => {
      if(!valid){
        return res.status(401).json({message: "Mauvais email ou mot de passe."})
      } else {
        console.log("CONNECTED");
        return res.status(200).json({
          user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            bio: user.bio,
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
    })
    .catch( error => {
      console.log({error});
      return res.status(500).json({message: "Erreur lors de la connexion."});
    });
    
};

exports.autoLogin = async (req, res, next) => {
  console.log("autoLogin ", req.body);

  try{
    const user = await User.findOne({ where:  { id: req.body.userId } });
    if(user == null){
      return res.status(404).json({message: "An error occured"});
    } 
    if( req.body.auto ){
      console.log("CONNECTED");
      return res.status(200).json({
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          bio: user.bio,
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
      return res.status(500).json({message: "Echec de la connexion automatique."});
    }
  } catch (error){
    console.log({error});
    return res.status(500).json({message: "Erreur lors de la connexion automatique."});
  }
  
};

exports.getOneById = async (req, res, next) => {
  console.log("getOneById user ");
  try{
    const user = await User.findOne({ where: {id: req.body.id}});
    if(user != undefined){
      return res.status(200).json({
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          bio: user.bio,
          // email: user.email,
          // admin: user.admin,
          profilPic: user.profilPic
        }
      });
    } else {
      return res.status(404).json({message:"Utilisateur non trouvé."});
    }
  }catch (error){
    console.log({error});
    return res.status(500).json({message: "Erreur lors de la récupération."});
  }

};

exports.modifyBio = async (req, res, next) => {
  console.log("params", req.params);
  console.log("body", req.body);
  let modification = {bio: req.body.bio};

  try{
    const bioModif = await User.update( modification, { where: { id: req.params.id }});
    console.log(bioModif);
    console.log(modification);
    return res.status(200).json({message: "Biography modified successfully"});
  } catch(err){
    console.log({error});
    return res.status(500).json({message:"Erreur lors de la modification."});
  }

};

exports.modifyProfilPic = async (req, res, next) => {
  console.log("modifyProfilPic");
  console.log("body", req.body);
  console.log("params", req.params);
  // console.log(req.file);

  try{
    let modification = {
      profilPic: `${req.protocol}://${req.get('host')}/images/profils/${req.file.filename}`
    };
    console.log(modification);

    const user = await User.findByPk(req.params.id, {raw: true });
    console.log("user", user);
    console.log("pic", user.profilPic.split('/images/profils/')[1]);
    if(user.profilPic.split('/images/profils/')[1] == "default_profil.png"){
      console.log("IF");
      const profilPicModif = await User.update( modification, { where: { id: req.params.id }});
    } else {
      console.log("ELSE");

      const userModif = User.update( modification, {
        where: {
            id: req.params.id
        }
      });

      fs.unlink(`images/profils/${user.profilPic.split('/images/profils/')[1]}`, () => {
        console.log(user.profilPic.split('/images/profils/')[1]);
      });
    }

    return res.status(200).json({message: "Profl pic modified successfully", newProfilPic: modification.profilPic});
  } catch(err){
    console.log({error});
    return res.status(500).json({message:"Erreur lors de la modification."});
  }
};

exports.modifyPassword = async (req, res, next) => {
  console.log("params pass", req.params);
  console.log("body", req.body);
  
  const user = await User.findByPk(req.body.userId, {raw: true});
  console.log(user);

    bcrypt.hash(req.body.newPassword, 10)
      .then( async(hash) => {
        const pwdModif = await User.update( {password: hash} , { where: { id: req.params.id }});

        return res.status(200).json({message: "Password modifié."});
      })
      .catch( error => res.status(500).json({message:"Erreur lors de la modification."}));

};

exports.delete = async (req, res, next) => {
  console.log("delete user body", req.body);
  console.log("delete user params", req.params);
  
  try{
    userToDelete = await User.findOne({
                                where: {
                                  id: req.params.id
                                }
                              });

    console.log(userToDelete);
    console.log(userToDelete.profilPic.split('/images/profils/')[1]);
    console.log( userToDelete.profilPic.split('/images/profils/')[1] != "default_profil.png");
    if( userToDelete.profilPic.split('/images/profils/')[1] != "default_profil.png"){
      console.log("dans le if");
      fs.unlink(`images/profils/${userToDelete.profilPic.split('/images/profils/')[1]}`, () => {
        console.log("delete profil pic");
      });
    }

    await User.destroy({
        where: {
        id: req.params.id
        }
    });
    return res.status(200).json({message: "User deleted successfully"});
  } catch (error) {
    console.log({error});
    return res.status(400).json({message: "Erreur lors de la suppression."});
}
};