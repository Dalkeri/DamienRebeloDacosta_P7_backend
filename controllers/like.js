const Like = require('../models/Like');
const Thread = require('../models/Thread');
// console.log("like controller")

exports.create = async (req, res, next) => {
    console.log("req", req.body);
    //check si on a du texte et / ou une image mais erreur si ni l'un ni l'autre
    const like = await Like.create({...req.body});
    res.json(like);
};

exports.getOne = async (req, res, next) => {
    console.log("getOne");
    //findByPK
    const like = await Like.findByPk(req.params.id, {
        raw: true
    });

    // console.log(like);
    return res.json(like);
};

exports.getAll = async (req, res, next) => {
    console.log("getAll");
    const likes = await Like.findAll({
        raw: true,
        include: User
    });
  
    console.log(likes);
    return res.json(likes);
};

exports.modify = async (req, res, next) => {
    console.log("modify", req.params);
    let modification = {...req.body};
    console.log("modif", modification);
    const likeModif = await Like.update( modification, {
        where: {
          id: req.params.id
        }
      });

    console.log(likeModif);
};

exports.delete = async (req, res, next) => {
    console.log("delete");
    const likeDelete =  await Like.destroy({
        where: {
          id: req.params.id
        }
      });
};