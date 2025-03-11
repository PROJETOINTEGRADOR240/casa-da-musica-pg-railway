const pool = require('../models/db');

exports.adicionarSensor = async (req, res) => {
    const { descricao } = req.body;
    try {
        await pool.query('INSERT INTO sensores (descricao) VALUES (?)', [descricao]);
        res.redirect(req.get('Referer') || '/');
    } catch (error) {
        res.status(500).send('Erro ao adicionar sensor.');
    }
};
