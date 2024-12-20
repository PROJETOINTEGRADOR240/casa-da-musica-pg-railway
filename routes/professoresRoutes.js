const express = require('express');
const router = express.Router();
const professoresController = require('../controllers/professoresController');


// Rota para listar professores
router.get('/', professoresController.listarProfessores);

// Rota para inserir uma professores
router.post('/inserir', professoresController.inserirProfessor);

// Rota para atualizar uma professores
router.post('/atualizar/:idprofessor', professoresController.atualizarProfessor);

// Rota para excluir uma professores
router.post('/excluir/:idprofessor', professoresController.excluirProfessor);

module.exports = router;


