const express = require('express');
const router = express.Router();
const answerController = require('../controllers/answerController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, answerController.createResposta);

module.exports = router;