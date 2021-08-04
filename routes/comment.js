const express = require('express');
const router = express.Router();
// console.log("comment routess")

const commentCtrl = require('../controllers/comment');

router.post('/', commentCtrl.create);
// router.get('/:id', commentCtrl.getOne);
// router.get('/:threadId', commentCtrl.getAll);
// router.delete('/:id', commentCtrl.delete);
// router.post('/:id', commentCtrl.modify);

// router.post('/:id/likes', commentCtrl.likes);

module.exports = router;