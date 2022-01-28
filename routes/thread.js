const express = require('express');
const router = express.Router();
// console.log("thread routes")

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const hasRights = require('../middleware/hasRights');
const threadCtrl = require('../controllers/thread');

router.post('/create', auth, multer, threadCtrl.create);
//add auth 
router.get('/:id', auth, threadCtrl.getOne);
router.get('/', auth, threadCtrl.getAll);
router.delete('/:id', auth, hasRights, threadCtrl.delete); 
router.put('/:id/modify/', auth, hasRights, multer, threadCtrl.modify);

// router.post('/:id/likes', threadCtrl.likes);

module.exports = router;