const db = require('../models/db');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');


// Página de relatórios
exports.showReportsPage = (req, res) => {
  res.render('reports');
};

// Geração de relatório por faixa etária
exports.generateReportByAge = (req, res) => {
  const { ageStart, ageEnd } = req.body;

  const query = `SELECT * FROM alunos WHERE idade BETWEEN ? AND ?`;
  db.execute(query, [ageStart, ageEnd], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Erro ao gerar o relatório');
    }

    const doc = new PDFDocument();
    const filePath = path.join(__dirname, '../public/reports', 'relatorio_idade.pdf');
    doc.pipe(fs.createWriteStream(filePath));

    doc.fontSize(18).text(`Relatório por Idade (${ageStart} - ${ageEnd})`, {
      align: 'center',
    });
    doc.moveDown();

    results.forEach((aluno, index) => {
      doc.fontSize(12).text(`${index + 1}. Nome: ${aluno.nome} | Idade: ${aluno.idade}`);
    });

    doc.end();

    res.download(filePath); // Envia o PDF para o usuário
  });
};

// Geração de relatório por sexo
exports.generateReportBySex = (req, res) => {
  const { sex } = req.body;
  let query = 'SELECT * FROM alunos WHERE sexo = ?';
  if (sex === 'both') {
    query = 'SELECT * FROM alunos'; // Todos os alunos
  }

  db.execute(query, [sex], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Erro ao gerar o relatório');
    }

    const doc = new PDFDocument();
    const filePath = path.join(__dirname, '../public/reports', 'relatorio_sexo.pdf');
    doc.pipe(fs.createWriteStream(filePath));

    doc.fontSize(18).text(`Relatório por Sexo (${sex})`, {
      align: 'center',
    });
    doc.moveDown();

    results.forEach((aluno, index) => {
      doc.fontSize(12).text(`${index + 1}. Nome: ${aluno.nome} | Sexo: ${aluno.sexo}`);
    });

    doc.end();

    res.download(filePath); // Envia o PDF para o usuário
  });
};
