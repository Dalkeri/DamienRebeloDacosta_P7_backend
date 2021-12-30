const express = require('express');
const router = express.Router();
// console.log("user routes")

const multer = require('../middleware/multer-config');
const auth = require('../middleware/auth');
const userCtrl = require('../controllers/user');

router.post('/getUserById',  auth, userCtrl.getOneById);

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.post("/autoLogin", auth, userCtrl.autoLogin);
//add hasRights below
router.post("/modifyBio", auth, userCtrl.modifyBio);
router.post("/modifyPassword", auth, userCtrl.modifyPassword);
router.post("/modifyProfilPic", auth, multer, userCtrl.modifyProfilPic);

module.exports = router;