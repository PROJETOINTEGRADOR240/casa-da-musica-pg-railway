const express = require('express');
const router = express.Router();
const methodOverride = require('method-override');

const {
    listarVinculos,
    inserirVinculo,
    atualizarVinculo,
    excluirVinculo,
    renderVinculosPage
    
} = require('../controllers/vinculosController');

// Middleware para sobrescrever métodos
router.use(methodOverride('_method'));


// Rota para renderizar a página com todas as vinculos
router.get('/vinculos', listarVinculos);

// Rota para renderizar a página com todas as vinculos
router.get('/', renderVinculosPage);

// Rota para criar uma novo vinculo
router.post('/', inserirVinculo);

// Atualizar vinculo (rota PUT)
router.put('/:idvinculo', atualizarVinculo);

// Excluir vinculo (rota DELETE)
router.delete('/:idvinculo', excluirVinculo);


module.exports = router;
