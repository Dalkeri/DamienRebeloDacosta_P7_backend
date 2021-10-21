const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  console.log("req.headers.authorization", req.headers.authorization);
  try {
    const token = req.headers.authorization.split(' ')[1];
    console.log("11111 ", token);
    console.log("req.body", req.body);
    const decodedToken = jwt.verify(token, "USER_SECRET_TOKEN");
    //check que le token est bon et pas expiré

    console.log("decodedToken ",decodedToken);
    const userId = decodedToken.userId;
    
    console.log("req.body ",req.body);
    // if(req.body.auto){
      req.body.userId = decodedToken.userId;
    // }
    // if( !req.body.auto ) {
      // if (req.body.userId && req.body.userId !== userId) {
      //   throw 'Invalid user ID';
      // } else {
      //   console.log("req.body.userId = userId;", req.body.userId = userId);
      //   req.body.userId = userId;
      console.log("next");
      next();
      // }
    // } else {
    //   console.log("auto");
    //   req.body.userId = userId;
    //   next();
    // }
    
  } catch {
    res.status(401).json({
    //   error: new Error('Invalid request!'),
      message: "wrong token"
    });
  }
};