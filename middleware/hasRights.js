const {  User, Thread, Comment } = require('../models')

//check that the person trying to do an action has the rights to do so (admin or owner of thread / comment)
module.exports = async (req, res, next) => {    
  let url = req.originalUrl;

  try {
    const user = await User.findOne({ where:  { id: req.body.userId } });

    if( url.includes("thread") ){
      const thread = await Thread.findOne({ where: { id: req.params.id } });
      if(user.admin || user.id == thread.userId ){
        next();
      } else {
          throw new Error("You don't have the rights for this action");
      }
    } else if( url.includes("comment") ) {
      const comment = await Comment.findOne({ where: { id: req.params.id } });
      if(user.admin || user.id == comment.userId ){
        next();
      } else {
        throw new Error("You don't have the rights for this action");
      }
    } else if(url.includes("user")){
      const userToModify = await User.findOne({ where: { id: req.params.id }});
      if(user.admin || user.id == userToModify.id){
        next();
      } else {
        throw new Error("You don't have the rights for this action");
      }
    }    
  } catch {
    return res.status(401).json({
    //   error: new Error('Invalid request!'),
      message: "Vous n'avez pas les droits pour cette action."
    });
  }
};