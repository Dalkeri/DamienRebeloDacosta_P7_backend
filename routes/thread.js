const express = require('express');
const router = express.Router();
// console.log("thread routes")

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const hasRights = require('../middleware/hasRights');
const threadCtrl = require('../controllers/thread');

router.post('/create', auth, multer, threadCtrl.create);
router.get('/:id', threadCtrl.getOne);
router.get('/', threadCtrl.getAll);
router.delete('/:id', auth, threadCtrl.delete);
router.put('/modify/:id', auth, hasRights, threadCtrl.modify);

// router.post('/:id/likes', threadCtrl.likes);

module.exports = router;