const { Thread, User, Comment, sequelize } = require('../models')
const { Sequelize, QueryTypes} = require('sequelize');
const fs = require('fs');

const Op = Sequelize.Op

exports.create = async (req, res, next) => {
    try{
        let img = req.file ? `${req.protocol}://${req.get('host')}/images/threads/${req.file.filename}` : null;

        if(!req.body.title){
            return res.status(401).json({message: "Le poste doit contenir un titre obligatoirement."})
        }

        const threadDatas = {
            ...req.body,
            image: img
        }
        const thread = await Thread.create(threadDatas);
        return res.status(200).json({thread});    
    } catch (error){
        console.log({error});
        return res.status(500).json({message: "Erreur lors de la création."});
    }
};

exports.getOne = async (req, res, next) => {
    try{
        const thread = await Thread.findOne({
            include : [{
                           model: User,
                           attributes: [ 'firstName', 'lastName', 'id' ]
                     }
                     ,
                     {
                         model: Comment,
                         attributes: [ 'id', 'content', 'userId'],
                         include: [{ model: User, attributes: [ 'firstName', 'lastName']}]
                     }
           ],
           where: {
               id: req.params.id
           }
       });
   
       return res.json(thread);
    } catch (error){
        console.log({error});
        return res.status(500).json({message: "Erreur lors de la récupération."});
    }

};

exports.getAll = async (req, res, next) => {
    try {
        const threads = await Thread.findAll({
            include : [{
                            model: User,
                            attributes: [ 'firstName', 'lastName','id' ]
                      }
                      ,
                      {
                          model: Comment,
                          attributes: [ 'id', 'content', 'userId', 'threadId'],
                          include: [{ model: User, attributes: [ 'firstName', 'lastName', 'id']}]
                      }
            ],
            order: [
                ['id', 'DESC']
            ]
        });
    
        return res.json(threads);
    } catch (error){
        console.log({error});
        return res.status(500).json({message: "Erreur lors de la récupération des données."});
    }
 
};

exports.modify = async (req, res, next) => {
    if(!req.body.title){
        return res.status(500).json({message: "Le poste doit contenir un titre obligatoirement."})
    }

    let modification = {
        title: req.body.title,
        content: req.body.content,
    };

    try{
        if(req.file){
            modification.image = `${req.protocol}://${req.get('host')}/images/threads/${req.file.filename}`;
        } else if(req.body.deletePic){
            modification.image = "";
        }

        const thread = await Thread.findByPk(req.params.id, { raw: true });
    
        if( (req.file || req.body.deletePic) && thread.image) {
            fs.unlink(`images/threads/${thread.image.split('/images/threads/')[1]}`, () => {                
                const threadModif = Thread.update( modification, {
                    where: {
                        id: req.params.id
                    }
                });
            });
        } else {
            let updatedThread = Thread.update( modification, {
                where: {
                    id: req.params.id
                }
            });
        }
    
        return res.status(200).json({message: "Content modified successfully"});
    } catch (error) {
        console.log({error});
        return res.status(500).json({message: "Erreur lors de la modification."});
    } 
};

exports.delete = async (req, res, next) => {
    try{
        const thread = await Thread.findOne({
            where: {
                id: req.params.id
            }
        });
        
        if(thread.image){
            fs.unlink(`images/threads/${thread.image.split('/images/threads/')[1]}`, () => {
                Thread.destroy({
                    where: {
                        id: req.params.id
                    }
                });
            });
        } else {
            Thread.destroy({
                where: {
                    id: req.params.id
                }
            });
        }

        return res.status(200).json({message: "Poste supprimé avec succès."});
    } catch (error) {
        console.log({error});
        return res.status(500).json({message: "Erreur lors de la suppression."});
    }
};