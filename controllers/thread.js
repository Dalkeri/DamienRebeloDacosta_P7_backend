const { Thread, User, Comment, sequelize } = require('../models')
const { Sequelize, QueryTypes} = require('sequelize');
const fs = require('fs');

const Op = Sequelize.Op

// console.log("thread controller", Thread);

exports.create = async (req, res, next) => {
    // console.log("req.body", req.body);
    // console.log("req.file", req.file);
    let img = req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : null;
    //check si on a du texte et / ou une image mais erreur si ni l'un ni l'autre
    const threadDatas = {
        ...req.body,
        image: img
    }
    const thread = await Thread.create(threadDatas);
    console.log(thread);
    res.status(200).json({thread});

    // res.json(thread);
};

exports.getOne = async (req, res, next) => {
    console.log("getOne", req.params);
    //findByPK
    const thread = await Thread.findOne({
         include : [{
                        model: User,
                        attributes: [ 'firstName', 'lastName' ]
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
};

exports.getAll = async (req, res, next) => {
    console.log("getAll", Thread);
    const threads = await Thread.findAll({
        // include: [{
        //     model: User,
        //     through: {
        //         attributes: [ 'firstName', 'lastName' ]
        //     }
        // }]
        include : [{
                        model: User,
                        attributes: [ 'firstName', 'lastName' ]
                  }
                  ,
                  {
                      model: Comment,
                      attributes: [ 'id', 'content', 'userId'],
                      include: [{ model: User, attributes: [ 'firstName', 'lastName']}]
                  }
        ],
        order: [
            ['id', 'DESC']
        ]
    });

    // const comments = await Comment.fi
    // for (const thread of threads){
    //     console.log("for ", thread.userId);
    //     console.log("for ", thread);
    //     const creator = await UserController.getOne(thread.userId);
    //     console.log("creator", creator);
    //     thread.firstName = creator.firstName;
    //     thread.lastName = creator.lastName;
    // };
    // console.log(threads);
    return res.json(threads);
};

exports.getAllFromUser = async (req, res, next) => {
    console.log("getAllFromUser");
    const threads = await Thread.findAll({
        where: {
            userId: req.body.userId
        },
        order: [
            ['id', 'DESC']
        ]
    });

    return res.json(threads);
}

//SELECT * FROM threads WHERE threads.id IN ( SELECT comments.threadId FROM comments JOIN users ON comments.userId = users.id WHERE users.id = 1)
//SELECT threads.title FROM threads WHERE threads.id IN ( SELECT comments.threadId FROM comments WHERE userId = 1)
// inner join
exports.getAllFromUserComments = async (req, res, next) => {
    console.log("getAllFromUserComments", req.body);
    const results = await sequelize.query(
        'SELECT * FROM threads WHERE threads.id IN ( SELECT comments.threadId FROM comments JOIN users ON comments.userId = users.id WHERE users.id = :id)',
        {
            replacements: { id: req.body.userId},
            type: QueryTypes.SELECT
        }
    )

    const results2 = await Comment.findAll({
        include : [{
                model: User,
            }
        ],
        order: [
            ['id', 'DESC']
        ]
    });

    console.log("coucou", results);
    return res.json(results);
}

exports.getCreator = async (userId) => {

}


//pas { modification }   ???
exports.modify = async (req, res, next) => {
    console.log(req.file);
    // console.log("modify body", req.body);
    // console.log("modify params", req.params);
    let modification = {
        title: req.body.title,
        content: req.body.content,
        image: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    };
    console.log("modif", modification);
    const thread = await Thread.findByPk(req.params.id, { raw: true });
    console.log("modify thread", thread);
    const threadModif = await Thread.update( modification, {
        where: {
            id: req.params.id
        }
    });
    console.log(threadModif);
    res.status(200).json({message: "Content modified successfully"});
};

exports.delete = async (req, res, next) => {
    console.log("delete");
    try{
        const threadDelete =  await Thread.destroy({
            where: {
            id: req.params.id
            }
        });
        res.status(200).json({message: "Thread deleted successfully"});
    } catch (error) {
        res.status(400).json({message: "Error while deleting"});
    }
    
};