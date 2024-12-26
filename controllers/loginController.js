const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');

exports.showLoginPage = (req, res) => {
    res.render('login', { error: null });
};

exports.processLogin = async (req, res) => {
    const { username, password } = req.body;

    try {
        if (!username || !password) {
            return res.render('login', { error: 'Por favor, preencha todos os campos.' });
        }

        // Verifica se o usuário existe
        const user = await userModel.getUserByUsername(username);
        if (!user) {
            return res.render('login', { error: 'Usuário ou senha inválidos.' });
        }

        // Valida a senha
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.render('login', { error: 'Usuário ou senha inválidos.' });
        }

        // Cria a sessão
        req.session.user = {
            id: user.id,
            username: user.username,
            email:user.email, // colocado aora 25/12/2024
            nivel: user.nivel
        };

        return res.redirect('/menu');
    } catch (error) {
        console.error(error);
        res.status(500).render('errorPage', { status: 500, message: 'Erro interno do servidor.' });
    }
};

exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            return res.status(500).render('errorPage', { status: 500, message: 'Erro ao sair da sessão.' });
        }
        res.redirect('/login');
    });
};
