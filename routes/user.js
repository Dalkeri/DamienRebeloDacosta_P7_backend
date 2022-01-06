const express = require('express');
const router = express.Router();
// console.log("user routes")

const multer = require('../middleware/multer-config');
const auth = require('../middleware/auth');
const userCtrl = require('../controllers/user');
const hasRights = require('../middleware/hasRights');

router.post('/getUserById',  auth, userCtrl.getOneById);

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.post("/autoLogin", auth, userCtrl.autoLogin);
router.post("/modifyBio", auth, userCtrl.modifyBio);//add hasRights
router.post("/modifyPassword", auth, userCtrl.modifyPassword);//add hasRights
router.post("/modifyProfilPic", auth, multer, userCtrl.modifyProfilPic);//add hasRights
router.delete('/:id', auth, hasRights, userCtrl.delete); //add hasRights

module.exports = router;