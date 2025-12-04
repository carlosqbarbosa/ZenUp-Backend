const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const mobileRegistroController = require('../controllers/mobileRegistroController');
const resumoController = require('../controllers/resumoController');
const chatController = require('../controllers/chatController');

router.post('/login', authController.login);
router.post('/registro-diario', authMiddleware, mobileRegistroController.registrarDiario);
router.get('/resumo/:id_usuario', authMiddleware, resumoController.getResumoByUsuario);
router.post('/chat', authMiddleware, chatController.chat);


module.exports = router;
