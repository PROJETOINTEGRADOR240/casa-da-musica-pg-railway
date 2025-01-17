const express = require('express');
const router = express.Router();
const relatorioProController = require('../controllers/relatorioProController');

// Rota para exibir o filtro do relatório
router.get('/filtro-relatorio-professor', relatorioProController.renderFiltroPro);

// Rota para gerar o relatório
router.post('/gerar-relatorio-professor', relatorioProController.gerarRelatorioPro);

module.exports = router;
