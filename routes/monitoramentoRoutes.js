const express = require('express');
const router = express.Router();
const pool = require('../models/db');
const monitoramentoController = require('../controllers/monitoramentoController');

// Registrar uma nova medição
router.post('/monitoramento', monitoramentoController.registrarMedicao);

// Buscar os últimos 10 registros de monitoramento
router.get('/monitoramento/dados', async (req, res) => {
    try {
        const [dados] = await pool.query(`
            SELECT 
                m.qualidade_ar, 
                m.data_hora,
                s.nome AS sala_nome, 
                se.descricao AS sensor_desc
            FROM monitoramento m
            JOIN salas s ON m.sala_id = s.id
            JOIN sensores se ON m.sensor_id = se.id
            ORDER BY m.data_hora DESC
            LIMIT 10
        `);
        res.json(dados);
    } catch (error) {
        console.error('Erro ao buscar registros:', error);
        res.status(500).json({ erro: 'Erro ao buscar os registros' });
    }
});

// Excluir registros excedentes (mantém apenas os últimos 10)
router.get('/monitoramento/excluiMaiorqueDez', async (req, res) => {
    try {
        await pool.query(`
            DELETE FROM monitoramento
            WHERE data_hora NOT IN (
                SELECT data_hora FROM (
                    SELECT data_hora 
                    FROM monitoramento 
                    ORDER BY data_hora DESC 
                    LIMIT 10
                ) AS ultimos_dez
            )
        `);
        res.status(200).json({ mensagem: 'Registros excedentes excluídos com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir registros excedentes:', error);
        res.status(500).json({ erro: 'Erro ao excluir registros excedentes' });
    }
});

module.exports = router;