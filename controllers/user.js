const { User } = require('../models')
const Sequelize = require('sequelize');
const fs = require('fs');
const Op = Sequelize.Op

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.signup = async (req, res, next) => {
    req.body.profilPic = `${req.protocol}://${req.get('host')}/images/profils/default_profil.png`; 

    let mailFormat = `^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$`;
    if( !req.body.email.match(mailFormat)){
      return res.status(401).json({message: "Le format de l'email est incorrect."});
    }
    
    try{
      bcrypt.hash(req.body.password, 10)
        .then( async (hash) => {       
          req.body.password = hash;

          const user = await User.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            profilPic: req.body.profilPic
          });

          return res.status(201).json({
            user: { 
              id: user.dataValues.id,
              firstName: user.dataValues.firstName,
              lastName: user.dataValues.lastName,
              email: user.dataValues.email,
              profilPic: user.dataValues.profilPic
            },
            token: jwt.sign(
              { userId: user.id },
              process.env.SECRET_PHRASE,
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
  const user = await User.findOne({ where:  { email: req.body.email } });

  if(user == null){
    return res.status(500).json({message: "Mauvais email ou mot de passe."});
  }
  
  bcrypt.compare(req.body.password, user.password)
    .then( valid => {
      if(!valid){
        return res.status(401).json({message: "Mauvais email ou mot de passe."})
      } else {
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
            process.env.SECRET_PHRASE,
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
  try{
    const user = await User.findOne({ where:  { id: req.body.userId } });

    if(user == null){
      return res.status(404).json({message: "An error occured"});
    } 

    if( req.body.auto ){
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
          process.env.SECRET_PHRASE,
          { expiresIn: '24h' }
        )
      });
    } else {
      return res.status(500).json({message: "Echec de la connexion automatique."});
    }
  } catch (error){
    console.log({error});
    return res.status(500).json({message: "Erreur de la connexion automatique."});
  }
};

exports.getOneById = async (req, res, next) => {
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
  let modification = {bio: req.body.bio};

  try{
    const bioModif = await User.update( modification, { where: { id: req.params.id }});
    return res.status(200).json({message: "Biography modified successfully"});
  } catch(err){
    console.log({error});
    return res.status(500).json({message:"Erreur lors de la modification."});
  }
};

exports.modifyProfilPic = async (req, res, next) => {
  try{
    let modification = {
      profilPic: `${req.protocol}://${req.get('host')}/images/profils/${req.file.filename}`
    };

    const user = await User.findByPk(req.params.id, {raw: true });
    if(user.profilPic.split('/images/profils/')[1] == "default_profil.png"){
      const profilPicModif = await User.update( modification, { where: { id: req.params.id }});
    } else {

      const userModif = User.update( modification, {
        where: {
            id: req.params.id
        }
      });
      
      fs.unlink(`images/profils/${user.profilPic.split('/images/profils/')[1]}`, () => {});
    }

    return res.status(200).json({message: "Profl pic modified successfully", newProfilPic: modification.profilPic});
  } catch(err){
    console.log({error});
    return res.status(500).json({message:"Erreur lors de la modification."});
  }
};

exports.modifyPassword = async (req, res, next) => {  
  const user = await User.findByPk(req.body.userId, {raw: true});

    bcrypt.hash(req.body.newPassword, 10)
      .then( async(hash) => {
        const pwdModif = await User.update( {password: hash} , { where: { id: req.params.id }});

        return res.status(200).json({message: "Password modifié."});
      })
      .catch( error => res.status(500).json({message:"Erreur lors de la modification."}));

};

exports.delete = async (req, res, next) => {  
  try{
    userToDelete = await User.findOne({
                                where: {
                                  id: req.params.id
                                }
                              });

    if( userToDelete.profilPic.split('/images/profils/')[1] != "default_profil.png"){
      fs.unlink(`images/profils/${userToDelete.profilPic.split('/images/profils/')[1]}`, () => {});
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