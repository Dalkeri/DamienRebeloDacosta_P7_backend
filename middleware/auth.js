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
    // if( !req.body.auto ) {
      if (req.body.userId && req.body.userId !== userId) {
        throw 'Invalid user ID';
      } else {
        console.log("req.body.UserId = userId;", req.body.UserId = userId);
        req.body.UserId = userId;
        next();
      }
    // } else {
    //   console.log("auto");
    //   req.body.UserId = userId;
    //   next();
    // }
    
  } catch {
    res.status(401).json({
    //   error: new Error('Invalid request!'),
      message: "wrong token"
    });
  }
};