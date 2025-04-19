const express = require('express');
const router = express.Router();
const alunosPcdController = require('../controllers/alunosPcdController');

router.get('/relatorio-menu', alunosPcdController.mostrarMenuRelatorio);
router.get('/relatorio-pcd', alunosPcdController.gerarRelatorio);
router.get('/grafico-pcd', alunosPcdController.gerarGrafico);
router.get('/gerar-pdf', alunosPcdController.baixarPDFRelatorio);
module.exports = router;