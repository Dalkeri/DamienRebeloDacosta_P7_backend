const { Thread, User, Comment } = require('../models')
const Sequelize = require('sequelize');
const Op = Sequelize.Op

exports.create = async (req, res, next) => {
    console.log("comment create req", req.body);
    //check si on a du texte et / ou une image mais erreur si ni l'un ni l'autre
    try{
        const comment = await Comment.create({...req.body});
        const user = await User.findByPk(req.body.userId, {raw: true });

        const commentToAdd = {
            id: comment.id,
            threadId: comment.threadId,
            content: comment.content,
            User: {
                firstName: user.firstName,
                lastName: user.lastName,
                id: user.id
            }
        }

        console.log(commentToAdd);
        res.status(200).json(commentToAdd);
    } catch (error) {
        console.log({error});
        res.status(500).json({message: "Erreur lors de la création."});
    }
   
};

exports.getOne = async (req, res, next) => {
    console.log("getOne");
    
    // const comment = await Comment.findByPk(req.params.id, {
    //     raw: true
    // });

    console.log(comment);
    return res.json(comment);
};

exports.getAll = async (req, res, next) => {
    console.log("getAll", req.params);
    // const comments = await Comment.findAll({
    //     // raw: true,
    //     include : [{
    //                 model: User,
    //                 attributes: [ 'firstName', 'lastName' ]
    //               }
    //     ],
    //     where: {
    //         ThreadId: req.params.threadId
    //     },
    //     order: [
    //         ['id', 'DESC']
    //     ]
    // });
  
    console.log(comments);
    return res.json(comments);
};

exports.modify = async (req, res, next) => {

    try{
        console.log("modify comment", req.body);
        let modification = {content : req.body.content};
        console.log("modif", modification);
        const comment = await Comment.findByPk(req.params.id, { raw: true });
        console.log("modify comment", comment);

        if(!comment){
            return res.status(404).json({message: "Comment not found"});
        }
    
        const commentModif = await Comment.update( modification, {
                                                        where: {
                                                        id: req.params.id
                                                        }
                                                    });
        console.log(commentModif);
                                                    
        const modifiedComment = {
            id: comment.id,
            threadId: comment.threadId,
            content: req.body.content,
 
        }
        console.log(modifiedComment);
        res.status(200).json(modifiedComment);
    } catch (error){
        console.log({error});
        res.status(500).json({message: "Erreur lors de la modification."})
    }

};

exports.delete = async (req, res, next) => {
    console.log("delete comment");
    try{
        const commentDelete =  await Comment.destroy({
            where: {
            id: req.params.id
            }
        });
        res.status(200).json({message: "Comment deleted successfully"});
    } catch (error) {
        console.log({error});
        res.status(500).json({message: "Erreur lors de la suppression."});
    }
};