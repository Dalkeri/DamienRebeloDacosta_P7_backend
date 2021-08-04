const express = require('express');
const router = express.Router();
// console.log("like routes")

const likeCtrl = require('../controllers/like');

router.post('/', likeCtrl.create);


module.exports = router;