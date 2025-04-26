const express = require('express');
const router = express.Router();
const pool = require('../models/db');
require('dotenv').config();

// Rota para validação de códigos
router.get('/:type/:code', async (req, res) => {
    const { type, code } = req.params;
    const tables = {
        aluno: 'alunos',
        professor: 'professores',
        disciplina: 'disciplinas'
    };

    if (!tables[type]) {
        return res.status(400).json({ success: false, message: 'Tipo inválido' });
    }

    try {
        const [rows] = await pool.query("SELECT nome FROM ${tables[type]} WHERE id${type} = $1", [code]);

        if (rows.length > 0) {
            res.json({ success: true, name: rows[0].nome });
        } else {
            res.json({ success: false, message: "${type.charAt(0).toUpperCase() + type.slice(1)} inexistente" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro ao verificar o código' });
    }
});

module.exports = router;
