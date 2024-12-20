const express = require('express');
const router = express.Router();
const methodOverride = require('method-override');

const {
    inserirFalta,
    atualizarFalta,
    excluirFalta,
    renderFaltasPage
    
} = require('../controllers/faltasController');

// Middleware para sobrescrever métodos
router.use(methodOverride('_method'));

// Rota para renderizar a página com todas as notas
router.get('/', renderFaltasPage);

// Rota para criar uma nova nota
router.post('/', inserirFalta);

// Atualizar nota (rota PUT)
router.put('/:idfalta', atualizarFalta);

// Excluir nota (rota DELETE)
router.delete('/:idfalta', excluirFalta);


module.exports = router;


