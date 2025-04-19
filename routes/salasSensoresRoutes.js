const express = require('express');
const router = express.Router();
const salasSensoresController = require('../controllers/salasSensoresController');

// Rota para exibir a tela de cadastro
router.get('/salasSensores', salasSensoresController.exibirCadastro);

// Rotas para Salas
router.post('/salas', salasSensoresController.criarSala);
router.get('/salas', salasSensoresController.listarSalas); // Para API ou atualização dinâmica
router.put('/salas/:id', salasSensoresController.atualizarSala);
router.delete('/salas/:id', salasSensoresController.excluirSala);

// Rotas para Sensores
router.post('/sensores', salasSensoresController.criarSensor);
router.get('/sensores', salasSensoresController.listarSensores); // Para API ou atualização dinâmica
router.put('/sensores/:id', salasSensoresController.atualizarSensor);
router.delete('/sensores/:id', salasSensoresController.excluirSensor);

module.exports = router;