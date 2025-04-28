const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { body } = require('express-validator');
const nodemailer = require('nodemailer');

router.post(
    '/login',
    [
        body('username', 'O nome de usuário é obrigatório.').notEmpty(),
        body('password', 'A senha é obrigatória.').notEmpty(),
    ],
    authController.postLogin
);

router.get('/', authController.getLoginPage);
router.post('/login', authController.postLogin);
router.get('/forgot-password', authController.getForgotPassword);
router.post('/forgot-password', authController.postForgotPassword);

// --------------No arquivo app.js ou authRoutes.js

// Middleware para verificar autenticação
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    }
    res.redirect('/');
}

// Rota do menu
router.get('/menu', isAuthenticated, (req, res) => {
    res.render('menu', { user: req.session.user });
});

// Rota de logout
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Erro ao destruir a sessão:', err);
            return res.status(500).send('Erro ao realizar logout.');
        }
        res.redirect('/'); // Redireciona para a página de login após logout
    });
});

/*
const transporter = nodemailer.createTransport({
    service: 'smtp-mail.outlook.com', // Ou o serviço que você está usando (exemplo: 'Outlook', 'Yahoo')
    port: '',
    secure: true, 
    auth: {
        user: '', // Substitua pelo seu e-mail
        pass: '' // Substitua pela senha do seu e-mail
    }
});

*/

// Verifica se a conexão com o serviço SMTP está funcionando
transporter.verify((error, success) => {
    if (error) {
        console.error('Erro ao configurar transporte de e-mail:', error);
    } else {
        console.log('Transporte de e-mail configurado com sucesso.');
    }
});



module.exports = router;
