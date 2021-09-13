const express = require('express');
const router = express.Router();
// console.log("thread routes")

const auth = require('../middleware/auth');
const threadCtrl = require('../controllers/thread');

router.post('/create', auth, threadCtrl.create);
router.get('/:id', threadCtrl.getOne);
router.get('/', threadCtrl.getAll);
router.delete('/:id', auth, threadCtrl.delete);
router.post('/:id', auth, threadCtrl.modify);

// router.post('/:id/likes', threadCtrl.likes);

module.exports = router;