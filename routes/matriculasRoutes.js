const express = require('express');
const router = express.Router();
const methodOverride = require('method-override');

const {
    inserirMatricula,
    atualizarMatricula,
    excluirMatricula,
    renderMatriculasPage
    
} = require('../controllers/matriculasController');

// Middleware para sobrescrever métodos
router.use(methodOverride('_method'));

// Rota para renderizar a página com todas as matriculas
router.get('/', renderMatriculasPage);

// Rota para criar uma nova matricula
router.post('/', inserirMatricula);

// Atualizar matricula (rota PUT)
router.put('/:idmatricula', atualizarMatricula);

// Excluir matricula (rota DELETE)
router.delete('/:idmatricula', excluirMatricula);


module.exports = router;


