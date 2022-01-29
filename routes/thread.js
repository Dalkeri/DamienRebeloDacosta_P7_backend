const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const hasRights = require('../middleware/hasRights');
const threadCtrl = require('../controllers/thread');

router.post('/create', auth, multer, threadCtrl.create);

router.get('/:id', auth, threadCtrl.getOne);
router.get('/', auth, threadCtrl.getAll);
router.put('/:id/modify/', auth, hasRights, multer, threadCtrl.modify);

router.delete('/:id', auth, hasRights, threadCtrl.delete); 

module.exports = router;