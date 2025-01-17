const express = require('express');
const router = express.Router();
const agePieController = require('../controllers/agePieController');

// Rota para gerar o gráfico de pizza
router.get('/age/pie-chart', agePieController.getPieChart);

module.exports = router;
