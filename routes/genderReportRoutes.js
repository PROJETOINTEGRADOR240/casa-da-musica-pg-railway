const express = require('express');
const router = express.Router();
const genderReportController = require('../controllers/genderReportController');
const path = require('path');

// Página principal de relatórios
router.get('/', (req, res) => {
    res.render('reportsMenu', { title: 'Relatórios Estatísticos' });
});


// Rotas de Gênero
router.get('/gender', (req, res) => res.render('genderReport'));
router.post('/gender/generate', genderReportController.generateGenderReport);


// Baixar o relatório
router.get('/download/:fileName', (req, res) => {
    const filePath = path.join(__dirname, '../public/reports', req.params.fileName);
    res.download(filePath, (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Erro ao baixar o relatório.');
        }
    });
});



// Visualizar o relatório
router.get('/view/:fileName', (req, res) => {
    const filePath = path.join(__dirname, '../public/reports', req.params.fileName);
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Erro ao visualizar o relatório.');
        }
    });
});

module.exports = router;
