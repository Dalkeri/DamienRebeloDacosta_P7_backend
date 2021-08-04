const Comment = require('../models/Comment');
const Thread = require('../models/Thread');
// console.log("comment controller")
exports.create = async (req, res, next) => {
    console.log("req", req.body);
    //check si on a du texte et / ou une image mais erreur si ni l'un ni l'autre
    const comment = await Comment.create({...req.body});
    res.json(comment);
};

exports.getOne = async (req, res, next) => {
    console.log("getOne");
    //findByPK
    const comment = await Comment.findByPk(req.params.id, {
        raw: true
    });

    // console.log(comment);
    return res.json(comment);
};

exports.getAll = async (req, res, next) => {
    console.log("getAll");
    const comments = await Comment.findAll({
        raw: true,
        include: User
    });
  
    console.log(comments);
    return res.json(comments);
};

exports.modify = async (req, res, next) => {
    console.log("modify", req.params);
    let modification = {...req.body};
    console.log("modif", modification);
    const commentModif = await Comment.update( modification, {
        where: {
          id: req.params.id
        }
      });

    console.log(commentModif);
};

exports.delete = async (req, res, next) => {
    console.log("delete");
    const commentDelete =  await Comment.destroy({
        where: {
          id: req.params.id
        }
      });
};