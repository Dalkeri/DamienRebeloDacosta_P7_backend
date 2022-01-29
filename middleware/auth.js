const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // console.log("req.headers.authorization", req.headers.authorization);
  // console.log("req.params", req.params);
  // console.log("req.body", req.body);
  try {
    const token = req.headers.authorization.split(' ')[1];
    // console.log("token ", token);
    // console.log("req.body", req.body);
    const decodedToken = jwt.verify(token, process.env.SECRET_PHRASE);
    //check que le token est bon et pas expiré

    console.log("decodedToken ",decodedToken);
    const userId = decodedToken.userId;
    
    // console.log("req.body ",req.body);
    // if(req.body.auto){
    req.body.userId = decodedToken.userId;
    req.params.userId = decodedToken.userId;
    // console.log("req.body ",req.body);
    // console.log("req.params ",req.params);

    // }
    // if( !req.body.auto ) { 
      // if (req.body.userId && req.body.userId !== userId) {
      //   throw 'Invalid user ID';
      // } else {
      //   console.log("req.body.userId = userId;", req.body.userId = userId);
      //   req.body.userId = userId;
      // console.log("next");
      next();
      // }
    // } else {
    //   console.log("auto");
    //   req.body.userId = userId;
    //   next();
    // }
    
  } catch {
    return res.status(401).json({
    //   error: new Error('Invalid request!'),
      message: "wrong token"
    });
  }
};