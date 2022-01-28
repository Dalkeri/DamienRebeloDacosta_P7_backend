const express = require('express');
const router = express.Router();
// console.log("user routes")

const multer = require('../middleware/multer-config');
const auth = require('../middleware/auth');
const userCtrl = require('../controllers/user');
const hasRights = require('../middleware/hasRights');

//TODO get
router.post('/getUserById',  auth, userCtrl.getOneById);

router.post('/signup', userCtrl.signup);

//TODO get
router.post('/login', userCtrl.login);
router.post("/autoLogin", auth, userCtrl.autoLogin);

//TODO put
router.post("/:id/modifyBio", auth, hasRights, userCtrl.modifyBio);
router.post("/:id/modifyPassword", auth, hasRights, userCtrl.modifyPassword);
router.post("/:id/modifyProfilPic", auth, hasRights, multer, userCtrl.modifyProfilPic);
router.delete('/:id', auth, hasRights, userCtrl.delete);

module.exports = router;