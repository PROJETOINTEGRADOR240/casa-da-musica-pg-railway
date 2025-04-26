const pool = require('../models/db');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const puppeteer = require('puppeteer');


exports.mostrarMenuRelatorio = (req, res) => {
    res.render('alunosPcd_menu');
};


exports.gerarRelatorio = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT idaluno, nome, idade, telefone, ativo, pcd, obs
            FROM alunos 
            WHERE pcd = "SIM"
        `);
        res.render('alunosPcd_relatorio', { alunos: rows }); // ← View correta
      } catch (error) {
        console.error('Erro ao gerar relatório PCD:', error);
        res.status(500).send('Erro ao gerar relatório.');
      }
};


exports.gerarGrafico = async (req, res) => {
    const [rows] = await pool.query('SELECT pcd FROM alunos');

    const total = rows.length;
    const simCount = rows.filter(a => a.pcd === 'SIM').length;
    const naoCount = total - simCount;
  
    const simPercent = total > 0 $1 ((simCount / total) * 100).toFixed(2) : 0;
    const naoPercent = total > 0 ? ((naoCount / total) * 100).toFixed(2) : 0;
  
    res.render('alunosPcd_grafico', {
      simPercent,
      naoPercent,
      simCount,
      naoCount,
      total,
    });
  };


exports.baixarPDFRelatorio = async (req, res) => {

    try {
        const [registros] = await pool.query("
        SELECT idaluno, nome, idade, telefone, pcd, ativo, obs
        FROM alunos 
        WHERE pcd = 'SIM'
        ");
    
        if (registros.length === 0) {
        return res.status(404).send('Nenhum aluno PCD encontrado.');
        }
    
        const doc = new PDFDocument({ size: 'A4', margin: 50 });
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = "Relatorio_Alunos_PCD_${timestamp}.pdf";
        const filepath = path.join(__dirname, "../temp/${filename}");
    
        if (!fs.existsSync(path.join(__dirname, '../temp'))) {
        fs.mkdirSync(path.join(__dirname, '../temp'));
        }
    
        const stream = fs.createWriteStream(filepath);
        doc.pipe(stream);
    
        // Cabeçalho
        doc.fontSize(16).text('Relatório de Aluno(a)s PCD', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text("Data/Hora: ${new Date().toLocaleString('pt-BR')}");
        doc.moveDown();
    
        // Cabeçalhos da tabela
        const startY = doc.y + 10;
        let y = startY;
        const rowHeight = 20;
/*---------------------------------------------------------    
        const col = {
            matricula: { x: 50, width: 60 },
            nome: { x: 115, width: 180 },
            idade: { x: 300, width: 35 },
            telefone: { x: 340, width: 100 },
            obs: { x: 445, width: 110 }
          };
----------------------------------------------------------------*/

        const col = {
          matricula: { x: 50, width: 60 },
          nome: { x: 115, width: 180 },
          idade: { x: 300, width: 35 },
          telefone: { x: 340, width: 100 },
          ativo: { x: 440, width: 35 },
          obs: { x: 480, width: 110 }
        };

          // Cabeçalho da tabela
          doc.font('Helvetica-Bold').fontSize(10);
          doc.text('Matrícula', col.matricula.x, y, { width: col.matricula.width, align: 'left' });
          doc.text('Nome', col.nome.x, y, { width: col.nome.width, align: 'left' });
          doc.text('Idade', col.idade.x, y, { width: col.idade.width, align: 'left' });
          doc.text('Telefone', col.telefone.x, y, { width: col.telefone.width, align: 'left' });
          doc.text('Ativo', col.ativo.x, y, { width: col.ativo.width, align: 'left' });
          doc.text('Observações', col.obs.x, y, { width: col.obs.width, align: 'left' });
          y += rowHeight;
          
          doc.font('Helvetica').fontSize(10);
          
          registros.forEach(aluno => {
            if (y + rowHeight > doc.page.height - 50) {
              doc.addPage();
              y = 50;
            }
          
            doc.text(aluno.idaluno.toString(), col.matricula.x, y, { width: col.matricula.width, align: 'left' });
            doc.text(aluno.nome, col.nome.x, y, { width: col.nome.width, align: 'left' });
            doc.text(aluno.idade.toString(), col.idade.x, y, { width: col.idade.width, align: 'left' });
            doc.text(aluno.telefone || '-', col.telefone.x, y, { width: col.telefone.width, align: 'left' });
            doc.text(aluno.ativo || '-', col.ativo.x, y, { width: col.ativo.width, align: 'left' });
            doc.text(aluno.obs || '-', col.obs.x, y, { width: col.obs.width, align: 'left' });
            y += rowHeight;
          });
          
        // Total
        y += 10;
        doc.font('Helvetica-Bold').fontSize(11).text("Total de Aluno(a)s PCD: ${registros.length}", 50, y);
    
        doc.end();
    
        stream.on('finish', () => {
        res.download(filepath, filename, (err) => {
            if (err) console.error('Erro ao enviar PDF:', err);
            fs.unlink(filepath, () => {});
        });
        });
    
    } catch (error) {
        console.error('Erro ao gerar PDF:', error);
        res.status(500).send('Erro ao gerar o PDF.');
    }
};

      