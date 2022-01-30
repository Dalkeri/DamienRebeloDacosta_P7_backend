const express = require('express');
const router = express.Router();

const multer = require('../middleware/multer-config');
const auth = require('../middleware/auth');
const userCtrl = require('../controllers/user');
const hasRights = require('../middleware/hasRights');

router.post('/getUserById',  auth, userCtrl.getOneById);

router.post('/signup', userCtrl.signup);

router.post('/login', userCtrl.login);
router.post("/autoLogin", auth, userCtrl.autoLogin);

router.put("/:id/modifyBio", auth, hasRights, userCtrl.modifyBio);
router.put("/:id/modifyPassword", auth, hasRights, userCtrl.modifyPassword);
router.put("/:id/modifyProfilPic", auth, hasRights, multer, userCtrl.modifyProfilPic);

router.delete('/:id', auth, hasRights, userCtrl.delete);

module.exports = router;