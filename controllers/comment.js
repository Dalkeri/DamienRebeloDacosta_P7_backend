const Comment = require('../models/Comment');
const Thread = require('../models/thread');
const User = require('../models/User');
// console.log("comment controller")

// User.hasMany(Thread);
// User.hasMany(Comment);

// Thread.belongsTo(User);
// Thread.hasMany(Comment);

// Comment.belongsTo(Thread);
// Comment.belongsTo(User);

exports.create = async (req, res, next) => {
    console.log("req", req.body);
    //check si on a du texte et / ou une image mais erreur si ni l'un ni l'autre
    const comment = await Comment.create({...req.body});
    res.json(comment);
};

exports.getOne = async (req, res, next) => {
    console.log("getOne");
    
    const comment = await Comment.findByPk(req.params.id, {
        raw: true
    });

    console.log(comment);
    return res.json(comment);
};

exports.getAll = async (req, res, next) => {
    console.log("getAll", req.params);
    const comments = await Comment.findAll({
        // raw: true,
        include : [{
                    model: User,
                    attributes: [ 'firstName', 'lastName' ]
                  }
        ],
        where: {
            ThreadId: req.params.threadId
        },
        order: [
            ['id', 'DESC']
        ]
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