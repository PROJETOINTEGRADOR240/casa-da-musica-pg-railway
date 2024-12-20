const express = require('express');
const router = express.Router();
const disciplinasController = require('../controllers/disciplinasController');


// Rota para listar disciplinas
router.get('/', disciplinasController.listarDisciplinas);

// Rota para inserir uma disciplinas
router.post('/inserir', disciplinasController.inserirDisciplina);

// Rota para atualizar uma disciplinas
router.post('/atualizar/:iddisciplina', disciplinasController.atualizarDisciplina);

// Rota para excluir uma disciplinas
router.post('/excluir/:iddisciplina', disciplinasController.excluirDisciplina);

module.exports = router;


