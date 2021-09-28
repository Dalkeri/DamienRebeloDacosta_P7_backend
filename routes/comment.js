const express = require('express');
const router = express.Router();
// console.log("comment routess")

const auth = require('../middleware/auth');
const commentCtrl = require('../controllers/comment');

router.post('/',auth, commentCtrl.create);
// router.get('/:id', commentCtrl.getOne);
router.get('/:threadId', commentCtrl.getAll);
// router.delete('/:id', commentCtrl.delete);
// router.post('/:id', commentCtrl.modify);

// router.post('/:id/likes', commentCtrl.likes);

module.exports = router;