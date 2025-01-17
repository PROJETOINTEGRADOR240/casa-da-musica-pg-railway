const express = require('express');
const router = express.Router();
const relatorioTaxController = require('../controllers/relatorioTaxController');

// Rota para exibir o filtro do relatório
router.get('/filtro-relatorio-qtdefaltas', relatorioTaxController.renderTaxFiltro);

// Rota para gerar o relatório
router.post('/gerar-relatorio-qtdefaltas', relatorioTaxController.gerarTaxRelatorio);

module.exports = router;
