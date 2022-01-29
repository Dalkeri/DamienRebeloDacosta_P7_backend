const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const hasRights = require('../middleware/hasRights');
const commentCtrl = require('../controllers/comment');

router.post('/create/',auth, commentCtrl.create);
// router.get('/:threadId', commentCtrl.getAll);
router.put('/:id/modify/',auth, hasRights, commentCtrl.modify);
router.delete('/:id', auth, hasRights, commentCtrl.delete);

module.exports = router;