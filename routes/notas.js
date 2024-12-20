const express = require('express');
const { processarNotas } = require('../utils/processNota'); // Importa função
const pool = require('../models/db'); // Assumindo que o pool de conexão está em um arquivo separado

const router = express.Router();

router.get('/notas', async (req, res) => {
    try {
        const [notas] = await pool.query('SELECT * FROM notas');
        console.log('Notas buscadas:', notas); // Log para verificar dados brutos
        const notasProcessadas = await processarNotas(notas);
        console.log('Notas processadas:', notasProcessadas); // Log para verificar dados finais
        res.render('notas', { notas: notasProcessadas });
    } catch (error) {
        console.error('Erro ao buscar notas:', error.message);
        res.status(500).send('Erro ao carregar as notas');
    } finally {
        console.log('Passou aqui:', notas); // Log para verificar dados brutos
    }
});

module.exports = router;
