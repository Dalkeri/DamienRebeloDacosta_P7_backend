const {  User, Thread } = require('../models')

module.exports = async (req, res, next) => {    
    console.log("req.params", req.params);
  console.log("req.headers.authorization", req.headers.authorization);
  try {
    
    const user = await User.findOne({ where:  { id: req.body.userId } });
    const thread = await Thread.findOne({ where: { id: req.params.id } });

    console.log(user.admin);
    console.log(thread);
    if(user.admin || user.id == thread.userId){
        console.log("next !!!!");
        next();
    } else {
        throw new Error("You don't have the rights for that");
    }
    
  } catch {
    res.status(401).json({
    //   error: new Error('Invalid request!'),
      message: "You don't have rights to do that"
    });
  }
};