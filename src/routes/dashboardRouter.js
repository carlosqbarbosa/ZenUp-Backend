const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require ('../middlewares/authMiddleware');
const checkRole = require('../middlewares/roleMiddleware');

const isGestor = checkRole('gestor');

router.get('/empresas/:id/indicadores', authMiddleware, isGestor, dashboardController.getIndicadoresAgregados);
router.get('/empresas/:id/usuarios', authMiddleware, isGestor, dashboardController.getUsuariosPorEmpresa);

module.exports = router;