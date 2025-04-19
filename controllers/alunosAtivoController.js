const pool = require('../models/db');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

exports.mostrarMenuRelatorio = (req, res) => {
    res.render('alunosAtivo_menu');
};

exports.gerarGrafico = async (req, res) => {
    const [rows] = await pool.query('SELECT ativo FROM alunos');

    const total = rows.length;
    const simCount = rows.filter(a => a.ativo === 'SIM').length;
    const naoCount = total - simCount;
  
    const simPercent = total > 0 ? ((simCount / total) * 100).toFixed(2) : 0;
    const naoPercent = total > 0 ? ((naoCount / total) * 100).toFixed(2) : 0;
  
    res.render('alunosAtivo_grafico', {
      simPercent,
      naoPercent,
      simCount,
      naoCount,
      total,
    });
  };
  
  exports.gerarRelatorioFiltrado = async (req, res) => {
    try {
      const filtro = req.query.filtro;
      let query = `SELECT idaluno, nome, idade, telefone, ativo, pcd FROM alunos`;
  
      if (filtro === 'SIM') {
        query += ` WHERE ativo = 'SIM'`;
      } else if (filtro === 'NÃO') {
        query += ` WHERE ativo = 'NÃO'`;
      }
  
      const [rows] = await pool.query(query);
      res.render('alunosAtivo_relatorio', { alunos: rows, filtro});
    } catch (error) {
      console.error('Erro ao gerar relatório com filtro:', error);
      res.status(500).send('Erro ao gerar relatório com filtro.');
    }
  };

  exports.baixarPDFFiltrado = async (req, res) => {
    try {
      const filtro = req.query.filtro;
      let query = `SELECT idaluno, nome, idade, telefone, ativo, pcd FROM alunos`;
  
      if (filtro === 'SIM') {
        query += ` WHERE ativo = 'SIM'`;
      } else if (filtro === 'NÃO') {
        query += ` WHERE ativo = 'NÃO'`;
      }
  
      const [registros] = await pool.query(query);

      if (registros.length === 0) {
        return res.status(404).send('Nenhum aluno encontrado.');
      }
  
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `Relatorio_Alunos_Ativo_Inativos_${timestamp}.pdf`;
      const filepath = path.join(__dirname, `../temp/${filename}`);
  
      if (!fs.existsSync(path.join(__dirname, '../temp'))) {
        fs.mkdirSync(path.join(__dirname, '../temp'));
      }
  
      const stream = fs.createWriteStream(filepath);
      doc.pipe(stream);
  
      doc.fontSize(16).text('Relatório de Aluno(a)s Ativo(s)/Inativo(s)', { align: 'center' });
      doc.moveDown();
      doc.fontSize(12).text(`Data/Hora: ${new Date().toLocaleString('pt-BR')}`);
      doc.moveDown();
  
      const rowHeight = 20;
      let y = doc.y + 10;
  
      const col = {
        matricula: { x: 50, width: 60 },
        nome: { x: 115, width: 180 },
        idade: { x: 300, width: 35 },
        telefone: { x: 340, width: 100 },
        ativo: { x: 445, width: 35 },
        pcd: { x: 490, width: 35 }
      };
  
      doc.font('Helvetica-Bold').fontSize(10);
      doc.text('Matrícula', col.matricula.x, y, { width: col.matricula.width });
      doc.text('Nome', col.nome.x, y, { width: col.nome.width });
      doc.text('Idade', col.idade.x, y, { width: col.idade.width });
      doc.text('Telefone', col.telefone.x, y, { width: col.telefone.width });
      doc.text('Ativo', col.ativo.x, y, { width: col.ativo.width });
      doc.text('PCD', col.pcd.x, y, { width: col.pcd.width });
      y += rowHeight;
  
      doc.font('Helvetica').fontSize(10);
  
      registros.forEach(aluno => {
        if (y + rowHeight > doc.page.height - 50) {
          doc.addPage();
          y = 50;
        }
  
        doc.text(aluno.idaluno.toString(), col.matricula.x, y);
        doc.text(aluno.nome, col.nome.x, y);
        doc.text(aluno.idade.toString(), col.idade.x, y);
        doc.text(aluno.telefone || '-', col.telefone.x, y);
        doc.text(aluno.ativo || '-', col.ativo.x, y);
        doc.text(aluno.pcd || '-', col.pcd.x, y);
        y += rowHeight;
      });
  
      y += 10;
      doc.font('Helvetica-Bold').fontSize(11).text(`Total: ${registros.length}`, 50, y);
  
      doc.end();
  
      stream.on('finish', () => {
        res.download(filepath, filename, err => {
          if (err) console.error('Erro ao enviar PDF:', err);
          fs.unlink(filepath, () => {});
        });
      });
  
    } catch (error) {
      console.error('Erro ao gerar PDF filtrado:', error);
      res.status(500).send('Erro ao gerar PDF filtrado.');
    }
  };
  
  