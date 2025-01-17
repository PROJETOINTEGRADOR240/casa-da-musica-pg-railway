const express = require('express');
const router = express.Router();
const ageChartController = require('../controllers/ageChartController');

// Rota para exibir o gráfico de barras
router.get('/age/bar-chart', ageChartController.generateBarChartPage);

module.exports = router;
