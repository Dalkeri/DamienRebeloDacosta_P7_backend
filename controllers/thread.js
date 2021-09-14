const Thread = require('../Models/thread');
const User = require('../Models/User');
const UserController = require('../controllers/User');
// console.log("thread controller", Thread);

exports.create = async (req, res, next) => {
    console.log("req", req.body);
    //check si on a du texte et / ou une image mais erreur si ni l'un ni l'autre

    const thread = await Thread.create({...req.body});
    // console.log(thread);
    res.status(200).json({thread});

    // res.json(thread);
};

exports.getOne = async (req, res, next) => {
    console.log("getOne");
    //findByPK
    const thread = await Thread.findByPk(req.params.id, {
        raw: true
    });

    // console.log(thread);
    return res.json(thread);
};

exports.getAll = async (req, res, next) => {
    // console.log("getAll", Thread);
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
        }],
        order: [
            ['id', 'DESC']
        ]
    });
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

exports.getCreator = async (userId) => {

}


//pas { modification }   ???
exports.modify = async (req, res, next) => {
    console.log("modify body", req.body);
    console.log("modify params", req.params);
    let modification = {
        title: req.body.title,
        content: req.body.content
    };
    console.log("modif", modification);
    const thread = await Thread.findByPk(req.params.id, { raw: true });
    console.log("modify thread", thread);
    if( thread.UserId == req.body.UserId){
        const threadModif = await Thread.update( modification, {
            where: {
              id: req.params.id
            }
          });
        console.log(threadModif);
        res.status(200).json({message: "Content modified successfully"});
    } else {
        res.status(201).json({message: "You can't modify this"});
    }
    

};

exports.delete = async (req, res, next) => {
    console.log("delete");
    const threadDelete =  await Thread.destroy({
        where: {
          id: req.params.id
        }
      });
};