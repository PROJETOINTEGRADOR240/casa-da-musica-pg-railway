const express = require('express');
const router = express.Router();

// Rota para o menu de relatórios
router.get('/', (req, res) => {
    res.render('reportsMenu'); // Renderiza a página do menu de relatórios
});

// Rota para a página de relatório por idade
router.get('/age', (req, res) => {
    res.render('ageReport'); // Renderiza a página de relatório por idade
});

// Rota para a página de relatório por sexo
router.get('/gender', (req, res) => {
    res.render('sexReport'); // Renderiza a página de relatório por sexo
});

// Rota para gerar relatório por idade
router.post('/age/generate', (req, res) => {
    const { ageStart, ageEnd } = req.body;
    res.send(`Relatório por idade de ${ageStart} a ${ageEnd} será gerado.`);
});

// Rota para gerar relatório por sexo
router.post('/gender/generate', (req, res) => {
    const { sex } = req.body;
    res.send(`Relatório por sexo (${sex}) será gerado.`);
});

module.exports = router;
