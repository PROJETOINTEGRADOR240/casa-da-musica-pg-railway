const bcrypt = require('bcryptjs');
const pool = require('../models/db');
const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator');

exports.getLoginPage = (req, res) => {
    res.render('auth/login', { message: req.flash('message') });
};

exports.postLogin = async (req, res) => {
    const { username, password } = req.body;

    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
        if (rows.length === 0) {
            req.flash('message', 'Usuário não encontrado.');
            return res.redirect('/');
        }

        const user = rows[0];
        if (user.status === 'desativado') {
            req.flash('message', 'Usuário desativado. Contate o administrador.');
            return res.redirect('/');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            req.flash('message', 'Senha incorreta.');
            return res.redirect('/');
        }

        req.session.user = { id: user.id, username: user.username, level: user.level };
        res.redirect('/menu');
    } catch (err) {
        console.error(err);
        res.render('auth/errorPage', { error: 'Erro no servidor.' });
    }
};

exports.getForgotPassword = (req, res) => {
    res.render('auth/forgot-password', { message: req.flash('message') });
};

exports.postForgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length === 0) {
            req.flash('message', 'E-mail não encontrado.');
            return res.redirect('/forgot-password');
        }

        const user = rows[0];
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
        });

        const resetLink = `http://localhost:3000/reset-password/${user.id}`;
        await transporter.sendMail({
            to: user.email,
            subject: 'Recuperação de Senha',
            text: `Clique no link para redefinir sua senha: ${resetLink}`,
        });

        req.flash('message', 'E-mail de recuperação enviado.');
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.render('auth/errorPage', { error: 'Erro no servidor.' });
    }
};


/* -----------------------------------------------------------------------*/

exports.postLogin = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // Retorna erros de validação para o cliente
        return res.status(400).render('auth/login', {
            message: errors.array().map((err) => err.msg).join(', '),
        });
    }

    const { username, password } = req.body;

    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
        if (rows.length === 0) {
            req.flash('message', 'Usuário não encontrado.');
            return res.redirect('/');
        }

        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            req.flash('message', 'Senha incorreta.');
            return res.redirect('/');
        }

        req.session.user = { id: user.id, username: user.username, level: user.level };
        res.redirect('/menu');
    } catch (err) {
        console.error(err);
        res.render('auth/errorPage', { error: 'Erro no servidor.' });
    }
};


/* ----------------------------------------------------------- */


