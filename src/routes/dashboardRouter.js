const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/roleMiddleware');
const checkCompanyAccess = require('../middlewares/resouceAuthMiddleware');

const isGestor = checkRole('gestor');

router.get('/empresas/:id/indicadores', authMiddleware, isGestor, checkCompanyAccess, dashboardController.getIndicadoresAgregados);
router.get('/empresas/:id/usuarios', authMiddleware, isGestor, checkCompanyAccess, dashboardController.getUsuariosPorEmpresa);

router.get('/empresas/:id/diarios', authMiddleware, isGestor, checkCompanyAccess, dashboardController.getDailyMetrics);
router.get('/empresas/:id/checkins-diarios', authMiddleware, isGestor, checkCompanyAccess, dashboardController.getCheckinsDiarios);

router.get('/empresas/:id_empresa/metrics/daily', authMiddleware, dashboardController.getDailyMetricsDetailed);
router.get('/empresas/:id_empresa/metrics/checkins-comparison', authMiddleware, dashboardController.getCheckinsComparison);
router.get('/empresas/:id_empresa/metrics/mood', authMiddleware, dashboardController.getMoodMetrics);

router.get('/empresas/:id_empresa/metrics/suggestions', authMiddleware, dashboardController.getSuggestions);

module.exports = router;