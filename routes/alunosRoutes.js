const express = require('express');
const router = express.Router();
const alunosController = require('../controllers/alunosController');


// Rota para listar alunos
router.get('/', alunosController.listarAlunos);

// Rota para inserir uma alunos
router.post('/inserir', alunosController.inserirAluno);

// Rota para atualizar uma alunos
router.post('/atualizar/:idaluno', alunosController.atualizarAluno);

// Rota para excluir uma alunos
router.post('/excluir/:idaluno', alunosController.excluirAluno);

module.exports = router;


