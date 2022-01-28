const {  User, Thread, Comment } = require('../models')

module.exports = async (req, res, next) => {    
  console.log("url", req.originalUrl);
  let url = req.originalUrl;

  try {
    
    const user = await User.findOne({ where:  { id: req.body.userId } });

    //todo: code dynamique, on coupe /api/thread/modify/3 selon / pour récupérer thread et on fait le reste automatiquement (cf models/index.js a partir ligne 20)
    if( url.includes("thread") ){
      const thread = await Thread.findOne({ where: { id: req.params.id } });
      if(user.admin || user.id == thread.userId ){
        console.log("next (thread)!!!!");
        next();
      } else {
          throw new Error("You don't have the rights for this action");
      }
    } else if( url.includes("comment") ) {
      const comment = await Comment.findOne({ where: { id: req.params.id } });
      if(user.admin || user.id == comment.userId ){
        console.log("next (comment)!!!!");
        next();
      } else {
        throw new Error("You don't have the rights for this action");
      }
    } else if(url.includes("user")){
      const userToModify = await User.findOne({ where: { id: req.params.id }});
      if(user.admin || user.id == userToModify.id){
        console.log("next (user)!!!!");
        next();
      } else {
        throw new Error("You don't have the rights for this action");
      }
    }
    
    
  } catch {
    res.status(401).json({
    //   error: new Error('Invalid request!'),
      message: "You don't have rights to do that"
    });
  }
};