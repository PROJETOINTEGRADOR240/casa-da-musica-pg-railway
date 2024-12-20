const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');

// Rota para exibir a página de login
router.get('/login', loginController.showLoginPage);

// Rota para processar o login
router.post('/login', loginController.processLogin);

// Rota para logout
router.post('/logout', loginController.logout);

module.exports = router;
