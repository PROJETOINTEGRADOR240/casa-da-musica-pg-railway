const express = require('express');
const router = express.Router();
const relatorioController = require('../controllers/relatorioController');

// Rota para exibir o filtro do relatório
router.get('/filtro-relatorio', relatorioController.renderFiltro);

// Rota para gerar o relatório
router.post('/gerar-relatorio', relatorioController.gerarRelatorio);

module.exports = router;
