const userModel = require('../models/userModel');

// Listar todos os usuários
exports.listarUsuarios = async (req, res) => {
    try {
        const usuarios = await userModel.getAllUsers();
        res.render('users', { usuarios });
    } catch (error) {
        res.status(500).render('errorPage', { error });
    }
};

// Criar usuário
exports.criarUsuario = async (req, res) => {
    try {
        await userModel.createUser(req.body);
        res.redirect('/users');
    } catch (error) {
        res.status(500).render('errorPage', { error });
    }
};

// Atualizar usuário
exports.atualizarUsuario = async (req, res) => {
    try {
        await userModel.updateUser(req.params.id, req.body);
        res.redirect('/users');
    } catch (error) {
        res.status(500).render('errorPage', { error });
    }
};

// Deletar usuário
exports.deletarUsuario = async (req, res) => {
    try {
        await userModel.deleteUser(req.params.id);
        res.redirect('/users');
    } catch (error) {
        res.status(500).render('errorPage', { error });
    }
};
