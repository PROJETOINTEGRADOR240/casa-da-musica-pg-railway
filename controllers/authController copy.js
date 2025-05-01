const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator');
const { Pool } = require('pg');

// Conexão com o PostgreSQL
const pgPool = new Pool({
  user: 'postgres',
  host: 'containers-us-west-XX.railway.app', // substitua pelo host correto
  database: 'railway',
  password: 'fmZjvmbamkIVEzsbuJYFgbAxyztttvOV', // ideal usar variável de ambiente
  port: 5432,
  ssl: { rejectUnauthorized: false }, // Necessário para Railway
});

// GET login
exports.getLoginPage = (req, res) => {
  res.render('auth/login', { message: req.flash('message') });
};

// POST login
exports.postLogin = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render('auth/login', {
      message: errors.array().map((err) => err.msg).join(', '),
    });
  }

  const { username, password } = req.body;
  console.log('Login recebido:', req.body);
  try {
    console.log('Conectando ao banco...');
    const result = await pgPool.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];
    console.log('Usuário encontrado:', user)
    if (!user) {
      req.flash('message', 'Usuário não encontrado.');
      return res.redirect('/');
    }

    if (user.status === 'desativado') {
      req.flash('message', 'Usuário desativado. Contate o administrador.');
      return res.redirect('/');
    }
    console.log(user.password)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      req.flash('message', 'Senha incorreta.');
      return res.redirect('/');
    }

    req.session.user = {
      id: user.id,
      username: user.username,
      level: user.level,
    };

    res.redirect('/menu');
  } catch (err) {
    console.error('Erro ao fazer login:', err);
    res.render('auth/errorPage', { error: 'Erro no servidor 1.' });
  }
};

// GET forgot-password
exports.getForgotPassword = (req, res) => {
  res.render('auth/forgot-password', { message: req.flash('message') });
};

// POST forgot-password
exports.postForgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const result = await pgPool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      req.flash('message', 'E-mail não encontrado.');
      return res.redirect('/forgot-password');
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
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
    console.error('Erro ao enviar email de recuperação:', err);
    res.render('auth/errorPage', { error: 'Erro no servidor 2.' });
  }
};
