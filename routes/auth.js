const express = require('express');
const router = express.Router();
const db = require('../models/db');

// Rota de login
router.post('/login', async (req, res) => {
    const { email } = req.body;

    try {
        // Verifica se o email existe na tabela "usuarios"
        const query = 'SELECT * FROM usuarios WHERE email = $1';
        const [rows] = await db.query(query, [email]);

        if (rows.length === 0) {
            return res.render('error', {
                message: 'Usuário não encontrado no sistema.',
            });
        }

        // Salva o email na sessão
        req.session.email = email;

        res.redirect('/menu');
    } catch (error) {
        console.error('Erro no login:', error);
        res.render('error', {
            message: 'Erro no login. Tente novamente mais tarde.',
        });
    }
});

module.exports = router;
