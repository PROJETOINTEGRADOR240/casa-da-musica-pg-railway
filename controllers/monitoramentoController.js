const pool = require('../models/db');
const express = require('express');
const app = express();

exports.registrarMedicao = async (req, res) => {
    const { sala_id, sensor_id, qualidade_ar } = req.body;
    try {
        await pool.query(
            'INSERT INTO monitoramento (sala_id, sensor_id, qualidade_ar, data_hora) VALUES (?, ?, ?, NOW())',
            [sala_id, sensor_id, qualidade_ar]
        );
        res.redirect(req.get('Referer') || '/');
    } catch (error) {
        res.status(500).send('Erro ao registrar medição.');
    }
};



