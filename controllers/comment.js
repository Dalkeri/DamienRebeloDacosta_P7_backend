const { Thread, User, Comment } = require('../models')
const Sequelize = require('sequelize');
const Op = Sequelize.Op

exports.create = async (req, res, next) => {
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
        
        return res.status(200).json(commentToAdd);
    } catch (error) {
        console.log({error});
        return res.status(500).json({message: "Erreur lors de la création."});
    }
};

//TODO
// exports.getAll = async (req, res, next) => {
//     console.log("getAll", req.params);
//     // const comments = await Comment.findAll({
//     //     // raw: true,
//     //     include : [{
//     //                 model: User,
//     //                 attributes: [ 'firstName', 'lastName' ]
//     //               }
//     //     ],
//     //     where: {
//     //         ThreadId: req.params.threadId
//     //     },
//     //     order: [
//     //         ['id', 'DESC']
//     //     ]
//     // });
  
//     console.log(comments);
//     return res.json(comments);
// };

exports.modify = async (req, res, next) => {

    try{
        let modification = {content : req.body.content};

        const comment = await Comment.findByPk(req.params.id, { raw: true });

        if(!comment){
            return res.status(404).json({message: "Comment not found"});
        }
    
        const commentModif = await Comment.update( modification, {
                                                        where: {
                                                        id: req.params.id
                                                        }
                                                    });
                                                    
        const modifiedComment = {
            id: comment.id,
            threadId: comment.threadId,
            content: req.body.content,
        }
        return res.status(200).json(modifiedComment);
    } catch (error){
        console.log({error});
        return res.status(500).json({message: "Erreur lors de la modification."})
    }
};

exports.delete = async (req, res, next) => {
    try{
        const commentDelete =  await Comment.destroy({
            where: {
            id: req.params.id
            }
        });
        return res.status(200).json({message: "Comment deleted successfully"});
    } catch (error) {
        console.log({error});
        return res.status(500).json({message: "Erreur lors de la suppression."});
    }
};