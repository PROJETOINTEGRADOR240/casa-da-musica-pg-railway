const pool = require('../models/db');
const pdfkit = require('pdfkit');
const fs = require('fs');

exports.showForm = (req, res) => {
  res.render('ageReport');
};

exports.generateReport = async (req, res) => {
  const { startAge, endAge } = req.body;

  try {
    const [rows] = await pool.execute(
      'SELECT * FROM alunos WHERE idade BETWEEN ? AND ?',
      [startAge, endAge]
    );

    // Gerar PDF
    const doc = new pdfkit();
    const fileName = `Relatorio_Por_Idade_${Date.now()}.pdf`;
    const filePath = `./public/reports/${fileName}`;

    doc.pipe(fs.createWriteStream(filePath));
    doc.fontSize(16).text('Relatório por Idade', { align: 'center' });
    doc.moveDown();

    rows.forEach((aluno) => {
      doc.fontSize(12).text(
        `ID: ${aluno.idaluno} - Nome: ${aluno.nome} - Idade: ${aluno.idade}`
      );
    });

    doc.moveDown();
    doc.fontSize(12).text(`Total de registros: ${rows.length}`);
    doc.end();

    res.download(filePath, (err) => {
      if (err) console.error(err);
      fs.unlinkSync(filePath); // Excluir o arquivo após o download
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao gerar relatório');
  }
};
