const express = require('express');
const router = express.Router();
const alunosAtivoController = require('../controllers/alunosAtivoController');

router.get('/relatorio-menu', alunosAtivoController.mostrarMenuRelatorio);
//router.get('/relatorio-ativo', alunosAtivoController.gerarRelatorio);
router.get('/grafico-ativo', alunosAtivoController.gerarGrafico);
//router.get('/gerar-ativo', alunosAtivoController.baixarPDFRelatorio);
router.get('/relatorio-filtrado', alunosAtivoController.gerarRelatorioFiltrado);
//router.get('/grafico-filtrado', alunosAtivoController.graficoFiltrado);
router.get('/pdf-filtrado', alunosAtivoController.baixarPDFFiltrado);

module.exports = router;