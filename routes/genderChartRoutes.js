const express = require('express');
const router = express.Router();
const genderChartController = require('../controllers/genderChartController');

// Rota para gerar o gráfico de Sexo
router.get('/gender/chart', genderChartController.generateGenderChart);

module.exports = router;
