
const express = require('express');
const router = express.Router();
const { buscaCep } = require('../controllers/cepController');


// Nova rota para buscar o CEP
router.get('/busca-cep/:cep', buscaCep);


module.exports = router;

