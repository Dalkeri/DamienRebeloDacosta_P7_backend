const { Thread, User, Comment, sequelize } = require('../models')
const { Sequelize, QueryTypes} = require('sequelize');
const fs = require('fs');

const Op = Sequelize.Op

exports.create = async (req, res, next) => {
    //TODO vérification qu'on a bien un titre minimum
    // si pas de content on met '' 
    console.log("CREATE", req.body);
    try{
        let img = req.file ? `${req.protocol}://${req.get('host')}/images/threads/${req.file.filename}` : null;

        if(!req.body.title){
            res.status(500).json({message: "Le poste doit contenir un titre obligatoirement."})
        }
        //check si on a du texte et / ou une image mais erreur si ni l'un ni l'autre
        const threadDatas = {
            ...req.body,
            image: img
        }
        const thread = await Thread.create(threadDatas);
        console.log(thread);
        res.status(200).json({thread});    
    } catch (error){
        console.log({error});
        res.status(500).json({message: "Erreur lors de la création."});
    }
};

exports.getOne = async (req, res, next) => {
    console.log("getOne", req.params);
    //findByPK
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
   
       // console.log(thread);
       return res.json(thread);
    } catch (error){
        console.log({error});
        res.status(500).json({message: "Erreur lors de la récupération."});
    }

};

exports.getAll = async (req, res, next) => {
    console.log("getAll", Thread);

    try {
        const threads = await Thread.findAll({
            // include: [{
            //     model: User,
            //     through: {
            //         attributes: [ 'firstName', 'lastName' ]
            //     }
            // }]
            include : [{
                            model: User,
                            attributes: [ 'firstName', 'lastName','id' ]
                      }
                      ,
                      {
                          model: Comment,
                          attributes: [ 'id', 'content', 'userId', 'threadId'],
                          include: [{ model: User, attributes: [ 'firstName', 'lastName']}]
                      }
            ],
            order: [
                ['id', 'DESC']
            ]
        });
    
        return res.json(threads);
        
    } catch (error){
        console.log({error});
        res.status(500).json({message: "Erreur lors de la récupération."});
    }
 
};

//pas { modification }   ???
exports.modify = async (req, res, next) => {
    console.log(req.file);
    console.log("modify body", req.body);
    console.log("modify params", req.params);

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
        console.log("modif", modification);
        const thread = await Thread.findByPk(req.params.id, { raw: true });
        console.log("modify thread", thread);
    
        let updatedThread;
        if( (req.file || req.body.deletePic) && thread.image) {
            fs.unlink(`images/threads/${thread.image.split('/images/threads/')[1]}`, () => {
                console.log(thread.image.split('/images/threads/')[1]);
                
                const threadModif = Thread.update( modification, {
                    where: {
                        id: req.params.id
                    }
                });
                console.log(threadModif);
            });
        } else {
            updatedThread = Thread.update( modification, {
                where: {
                    id: req.params.id
                }
            });
        }
    
        res.status(200).json({message: "Content modified successfully"});

    } catch (error) {
            console.log({error});
            res.status(500).json({message: "Erreur lors de la modification."});
    } 
    
};

exports.delete = async (req, res, next) => {
    console.log("delete");
    console.log("params", req.params);
    console.log("body", req.body);

    try{
        const thread = await Thread.findOne({
            where: {
                id: req.params.id
            }
        });
        
        if(thread.image){
            fs.unlink(`images/threads/${thread.image.split('/images/threads/')[1]}`, () => {
                console.log(thread.image.split('/images/threads/')[1]);
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

        res.status(200).json({message: "Thread deleted successfully"});
    } catch (error) {
        console.log({error});
        res.status(500).json({message: "Erreur lors de la suppression."});
    }
    
};