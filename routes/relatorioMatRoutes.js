const express = require('express');
const router = express.Router();
const relatorioMatController = require('../controllers/relatorioMatController');

// Rota para exibir o filtro do relatório
router.get('/filtro-relatorio-matridisci', relatorioMatController.renderMatFiltro);

// Rota para gerar o relatório
router.post('/gerar-relatorio-matridisci', relatorioMatController.gerarMatRelatorio);

module.exports = router;
