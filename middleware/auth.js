const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  console.log("req.headers.authorization", req.headers.authorization);
  try {
    const token = req.headers.authorization.split(' ')[1];
    console.log("1", token);
    const decodedToken = jwt.verify(token, "USER_SECRET_TOKEN");
    console.log("2",decodedToken);
    const userId = decodedToken.userId;
    console.log("3",userId);
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID';
    } else {
      req.body.UserId = userId;
      next();
    }
  } catch {
    res.status(401).json({
    //   error: new Error('Invalid request!'),
      message: "mauvais token"
    });
  }
};