const express = require('express');
const router = express.Router();
const authorize = require('../middlewares/auth');

// Rota do menu principal
router.get('/menu', (req, res) => {
    const { email } = req.session;
    res.render('menu', { email });
});

// Rotas protegidas com níveis de acesso dinâmicos
router.get('/alunos', authorize([1, 2]), (req, res) => res.render('alunos'));
router.get('/disciplinas', authorize([1, 2]), (req, res) => res.render('disciplinas'));
router.get('/professores', authorize([1, 2]), (req, res) => res.render('professores'));
router.get('/notas', authorize([1]), (req, res) => res.render('notas'));
router.get('/faltas', authorize([1]), (req, res) => res.render('faltas'));
router.get('/presenca', authorize([1, 2, 3]), (req, res) => res.render('presenca'));
router.get('/relatorios', authorize([1, 2, 3]), (req, res) => res.render('relatorios'));
router.get('/usuarios', authorize([1, 2]), (req, res) => res.render('usuarios'));

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/login'));
});

module.exports = router;
