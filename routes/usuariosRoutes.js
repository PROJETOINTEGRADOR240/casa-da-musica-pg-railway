const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');


// Rota para listar usuarios
router.get('/', usuariosController.listarUsuarios);

// Rota para inserir um usuario
router.post('/inserir', usuariosController.inserirUsuario);

// Rota para atualizar um usuario
router.post('/atualizar/:idusuario', usuariosController.atualizarUsuario);

// Rota para excluir uma disciplinas
router.post('/excluir/:idusuario', usuariosController.excluirUsuario);

module.exports = router;


