const express = require('express');
const router = express.Router();
const relatorioDisciplinaProfessorController = require('../controllers/relatorioDisciplinaProfessorController');

// Rota para exibir o filtro do relatório
router.get('/filtro-relatorio-disciplina-professor', relatorioDisciplinaProfessorController.renderFiltroDisProf);

// Rota para gerar o relatório
router.post('/gerar-relatorio-disciplina-professor', relatorioDisciplinaProfessorController.gerarRelatorioDisProf);

module.exports = router;
