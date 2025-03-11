const express = require('express');
const router = express.Router();
const pool = require('../models/db');
const monitoramentoController = require('../controllers/monitoramentoController');

router.post('/monitoramento', monitoramentoController.registrarMedicao);

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

        res.json(dados); // Envia os dados como JSON
    } catch (error) {
        console.error('Erro ao buscar registros:', error);
        res.status(500).json({ erro: 'Erro ao buscar os registros' });
    }
});


// Rota para registrar medição
router.get('/monitoramento/excluiMaiorqueDez', async (req, res) => {

    // Verificar o número de registros na tabela monitoramento
    const [rows] = await pool.query('SELECT COUNT(*) as count FROM monitoramento');

    if (rows[0].count > 11) {
        // Apagar o registro mais antigo (FIFO)
        await pool.query('DELETE FROM monitoramento ORDER BY data_hora ASC LIMIT 1');
    }

    // Redirecionar de volta para a página
    res.redirect('/');
});


module.exports = router;
