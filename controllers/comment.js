const { Thread, User, Comment } = require('../models')
const Sequelize = require('sequelize');
const Op = Sequelize.Op

exports.create = async (req, res, next) => {
    console.log("comment create req", req.body);
    //check si on a du texte et / ou une image mais erreur si ni l'un ni l'autre
    const comment = await Comment.create({...req.body});
    // return res.json(comment);
    console.log(comment);
    res.status(200).json(comment);
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

// exports.getAllFromUser = async (req, res, next) => {
//     console.log("getAllFromUser");
//     const comments = await Comment.findAll(      
//         where: {
//             userId: req.body.userId
//         },                    SELECT * FROM users JOIN comments ON users.id = comments.userId JOIN threads ON comments.threadId = threads.id WHERE users.userId = 1
//         order: [          SELECT * FROM threads WHERE threads.id IN ( SELECT comments.threadId FROM comments JOIN users ON comments.userId = users.id WHERE users.id = 1)
//             ['id', 'DESC']
//         ]
//     });

//     return res.json(comments);
// }

exports.modify = async (req, res, next) => {
    console.log("modify comment", req.body);
    let modification = {content : req.body.content};
    console.log("modif", modification);
    const comment = await Comment.findByPk(req.params.id, { raw: true });
    console.log("modify comment", comment);

    const commentModif = await Comment.update( modification, {
                                                    where: {
                                                    id: req.params.id
                                                    }
                                                });
    // console.log(commentModif);
    res.status(200).json({message: "Content modified successfully"});
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
        res.status(400).json({message: "Error while deleting"});
    }
};