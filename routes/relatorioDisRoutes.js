const express = require('express');
const router = express.Router();
const relatorioDisController = require('../controllers/relatorioDisController');

// Rota para exibir o filtro do relatório
router.get('/filtro-relatorio-disciplina', relatorioDisController.renderFiltroDis);

// Rota para gerar o relatório
router.post('/gerar-relatorio-disciplina', relatorioDisController.gerarRelatorioDis);

module.exports = router;
