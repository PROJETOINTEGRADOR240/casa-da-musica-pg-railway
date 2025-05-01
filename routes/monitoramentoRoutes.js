const express = require('express');
const router = express.Router();
const pool = require('../models/db');
const monitoramentoController = require('../controllers/monitoramentoController');

router.post('/monitoramento', monitoramentoController.registrarMedicao);

router.get('/monitoramento/dados', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        m.qualidade_ar, 
        m.data_hora,
        s.nome AS sala_nome, 
        se.descricao AS sensor_desc
      FROM casadamusica.monitoramento m
      JOIN casadamusica.salas s ON m.sala_id = s.id
      JOIN casadamusica.sensores se ON m.sensor_id = se.id
      ORDER BY m.data_hora DESC
      LIMIT 10
    `);

    res.json(result.rows); // Envia os dados como JSON
  } catch (error) {
    console.error('Erro ao buscar registros:', error);
    res.status(500).json({ erro: 'Erro ao buscar os registros' });
  }
});

router.get('/monitoramento/excluiMaiorqueDez', async (req, res) => {
  try {
    // Verificar o número de registros na tabela monitoramento
    const countResult = await pool.query('SELECT COUNT(*) as count FROM casadamusica.monitoramento');
    const count = countResult.rows[0].count;

    if (count > 11) {
      // Apagar o registro mais antigo (FIFO)
      await pool.query('DELETE FROM casadamusica.monitoramento WHERE data_hora = (SELECT data_hora FROM casadamusica.monitoramento ORDER BY data_hora ASC LIMIT 1)');
    }

    // Redirecionar de volta para a página
    res.redirect('/');
  } catch (error) {
    console.error('Erro ao excluir registros:', error);
    res.status(500).send('Erro ao excluir registros');
  }
});

module.exports = router;