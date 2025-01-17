const express = require('express');
const router = express.Router();
const demandasController = require('../controllers/demandasController');

router.get('/filtro-relatorio-demanda', demandasController.renderFilterPage);
//router.post('/generate', demandasController.generateChart);
router.post('/gerar-relatorio-demanda', demandasController.generateChart);

module.exports = router;
