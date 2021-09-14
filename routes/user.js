const express = require('express');
const router = express.Router();
// console.log("user routes")

const auth = require('../middleware/auth');
const userCtrl = require('../controllers/user');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.post("/autoLogin", auth, userCtrl.autoLogin);

module.exports = router;