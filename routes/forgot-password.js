const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { validationResult } = require('express-validator');
const User = require('../models/userModel'); // Modelo de usuário
const sendResetEmail = require('../utils/sendResetEmail'); // Função de envio de e-mail
const crypto = require('crypto');

const userModel = require('../models/userModel'); // Verifique se o userModel está configurado corretamente

router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        // Verificar se o e-mail está cadastrado
        const user = await userModel.findByEmail(email);

        if (!user) {
            return res.render('forgot-password', {
                error: 'O e-mail inserido não está cadastrado no sistema.',
                success: null,
            });
        }

        // Gerar token de recuperação e enviar e-mail
        const resetToken = userModel.generateResetToken(user.id); // Gere um token único
        await sendResetEmail(email, resetToken);

        res.render('forgot-password', {
            error: null,
            success: 'Um link de redefinição de senha foi enviado para o seu e-mail.',
        });
    } catch (err) {
        console.error(err);
        res.render('forgot-password', {
            error: 'Ocorreu um erro ao processar sua solicitação. Tente novamente.',
            success: null,
        });
    }
});

router.post(
    '/',
    [
        check('email').isEmail().withMessage('Por favor, insira um e-mail válido.'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render('forgot-password', { error: errors.array()[0].msg });
        }

        const { email } = req.body;

        try {
            // Verifica se o e-mail existe no banco de dados
            const user = await User.findOneByEmail(email);
            if (!user) {
                return res.render('forgot-password', {
                    error: 'Usuário não encontrado.',
                });
            }

            // Gera o token de redefinição
            const resetToken = crypto.randomBytes(32).toString('hex');
            const tokenExpiration = new Date(Date.now() + 3600000); // 1 hora a partir de agora

            // Atualiza o token e a validade no banco de dados
            await User.updateResetToken(email, resetToken, tokenExpiration);

            // Envia o e-mail
            await sendResetEmail(email, resetToken);

            res.render('forgot-password', {
                success: 'E-mail de recuperação enviado com sucesso!',
            });
        } catch (error) {
            console.error(error);
            res.render('errorPage', {
                status: 500,
                message: 'Erro ao processar o pedido de redefinição de senha.',
            });
        }
    }
);


module.exports = router;
