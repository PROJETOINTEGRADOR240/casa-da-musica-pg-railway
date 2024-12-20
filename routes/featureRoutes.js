// routes/featureRoutes.js
const express = require('express');
const router = express.Router();

// Middleware para autenticação
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    }
    res.redirect('/');
}
/*
// Rota para a página de notas
router.get('/notas', isAuthenticated, (req, res) => {
    res.render('notas', { user: req.session.user });
});

// Rota para a página de faltas
router.get('/faltas', isAuthenticated, (req, res) => {
    res.render('faltas', { user: req.session.user });
});

*/

module.exports = router;
