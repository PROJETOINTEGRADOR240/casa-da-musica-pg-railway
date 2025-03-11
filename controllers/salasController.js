const pool = require('../models/db');

exports.adicionarSala = async (req, res) => {
    const { nome } = req.body;
    try {
        await pool.query('INSERT INTO salas (nome) VALUES (?)', [nome]);
        res.redirect(req.get('Referer') || '/');
    } catch (error) {
        res.status(500).send('Erro ao adicionar sala.');
    }
};
