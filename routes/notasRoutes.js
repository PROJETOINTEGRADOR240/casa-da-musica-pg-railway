const express = require('express');
const router = express.Router();
const methodOverride = require('method-override');

const {
    inserirNota,
    atualizarNota,
    excluirNota,
    renderNotasPage
    
} = require('../controllers/notasController');

// Middleware para sobrescrever métodos
router.use(methodOverride('_method'));

// Rota para renderizar a página com todas as notas
router.get('/', renderNotasPage);

// Rota para criar uma nova nota
router.post('/', inserirNota);

// Atualizar nota (rota PUT)
router.put('/:idnota', atualizarNota);

// Excluir nota (rota DELETE)
router.delete('/:idnota', excluirNota);


module.exports = router;
