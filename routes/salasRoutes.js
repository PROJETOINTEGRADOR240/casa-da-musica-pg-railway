const express = require('express');
const router = express.Router();
const salasController = require('../controllers/salasController');

router.post('/salas', salasController.adicionarSala);

module.exports = router;
