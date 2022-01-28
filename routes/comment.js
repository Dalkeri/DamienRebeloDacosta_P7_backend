const express = require('express');
const router = express.Router();
// console.log("comment routess")

const auth = require('../middleware/auth');
const hasRights = require('../middleware/hasRights');
const commentCtrl = require('../controllers/comment');

router.post('/create/',auth, commentCtrl.create);
// router.get('/:id', commentCtrl.getOne);
router.get('/:threadId', commentCtrl.getAll);
router.put('/:id/modify/',auth, hasRights, commentCtrl.modify);
router.delete('/:id', auth, hasRights, commentCtrl.delete);

// router.post('/:id/likes', commentCtrl.likes);

module.exports = router;