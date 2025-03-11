const express = require('express');
const router = express.Router();
const sensoresController = require('../controllers/sensoresController');

router.post('/sensores', sensoresController.adicionarSensor);

module.exports = router;
