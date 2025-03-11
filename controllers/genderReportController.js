const pool = require('../models/db');
const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');
const { DateTime } = require('luxon');

exports.generateGenderReport = async (req, res) => {
  const { gender } = req.body;

  try {
    // Configurar consulta SQL
    let query = 'SELECT idaluno, nome, LOWER(sexo) AS sexo FROM alunos';
    const params = [];

    if (gender !== 'Todos') {
      query += ' WHERE LOWER(sexo) IN (?, ?)';
      if (gender === 'Masculino') {
        params.push('masculino', 'm');
      } else if (gender === 'Feminino') {
        params.push('feminino', 'f');
      }
    }

    query += ' ORDER BY nome ASC';

    // Executar a consulta
    const [rows] = await pool.query(query, params);

    if (rows.length === 0) {
      return res.status(404).send('Nenhum aluno encontrado para o gênero especificado.');
    }

    // Contadores
    const totalMasculino = rows.filter(row => row.sexo === 'masculino' || row.sexo === 'm').length;
    const totalFeminino = rows.filter(row => row.sexo === 'feminino' || row.sexo === 'f').length;
    const totalGeral = totalMasculino + totalFeminino;

    // Configuração do PDF
    const timestamp = Date.now();
    const fileName = `Relatorio_Sexo_${timestamp}.pdf`;
    const filePath = path.join(__dirname, '../public/reports', fileName);

    const reportsDir = path.dirname(filePath);
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    const doc = new PDFDocument({ margin: 30, size: 'A4' });
    doc.pipe(fs.createWriteStream(filePath));

    // Variáveis de controle de página
    let pageCount = 1;
    let lineCount = 0; // Contador de linhas impressas por página

    // Função para desenhar cabeçalho
    const drawHeader = () => {
      const now = DateTime.now().toFormat('dd/MM/yyyy HH:mm:ss');
      doc.fontSize(10).font('Helvetica-Oblique').text(`Data e Hora: ${now}`, { align: 'left' });
      doc.text(`Página: ${pageCount}`, { align: 'right' });
      doc.moveDown(1);

      doc.fontSize(14).font('Helvetica-Bold').text(`Relatório por Sexo (${gender === 'Todos' ? 'Todos' : gender})`, { align: 'center' });
      doc.moveDown(1);

      // Cabeçalhos das colunas
      const headers = ['Matrícula', 'Nome', 'Sexo'];
      const columnWidths = [100, 300, 100];
      let xPosition = 50;
      const initialY = doc.y;

      doc.fontSize(12).font('Helvetica-Bold');
      headers.forEach((header, index) => {
        doc.text(header, xPosition, initialY, { width: columnWidths[index], align: 'left' });
        xPosition += columnWidths[index] + 20;
      });

      doc.moveDown(1);
      lineCount = 0; // Resetar contador de linhas ao desenhar o cabeçalho
    };

    // Imprimir cabeçalho inicial
    drawHeader();

    // Dados dos Alunos
    doc.font('Helvetica').fontSize(10);
    rows.forEach((row, index) => {
      if (lineCount >= 58) { // Limite de 58 linhas por página
        pageCount++;
        doc.addPage();
        drawHeader();
      }

      let xPosition = 50;
      const currentY = doc.y;

      doc.text(row.idaluno.toString(), xPosition, currentY, { width: 100, align: 'left' });
      xPosition += 120;

      doc.text(row.nome, xPosition, currentY, { width: 300, align: 'left' });
      xPosition += 320;

      const formattedSexo = row.sexo === 'masculino' || row.sexo === 'm' ? 'Masculino' : 'Feminino';
      doc.text(formattedSexo, xPosition, currentY, { width: 100, align: 'left' });

      doc.moveDown(0.5);
      lineCount++; // Incrementar contador de linhas
    });

    // Exibir contadores no final da última página
    doc.moveDown(2);
    doc.font('Helvetica-Bold').fontSize(12);
    doc.text(`Quantidade de aluno(s): ${totalMasculino}`, 50, doc.y, { align: 'left' });
    doc.text(`Quantidade de aluna(s): ${totalFeminino}`, 50, doc.y + 3, { align: 'left' });
    doc.text(`Total Geral --------->: ${totalGeral}`, 50, doc.y + 20, { align: 'left' });

    doc.end();

    // Redirecionar para a tela de opções
    res.render('reportOptionsGender', {
      title: 'Relatório por Sexo',
      downloadUrl: `/reports/download/${fileName}`,
      viewUrl: `/reports/view/${fileName}`,
      backUrl: '/reports/gender',
    });

  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao gerar o relatório.');
  }
};
