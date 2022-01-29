const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];

    //check that token is not expired and is correct
    const decodedToken = jwt.verify(token, process.env.SECRET_PHRASE);

    const userId = decodedToken.userId;
    
    req.body.userId = decodedToken.userId;
    req.params.userId = decodedToken.userId;
    
    next();
  } catch {
    return res.status(401).json({
      message: "Wrong token"
    });
  }
};