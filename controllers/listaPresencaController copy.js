const pool = require("../models/db");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const os = require("os");


exports.exibirFiltro = (req, res) => {
  res.render("listaPresenca/filtro");
};


exports.gerarLista = async (req, res) => {
  const { disciplinaInicial, disciplinaFinal } = req.body;

  if (!disciplinaInicial || !disciplinaFinal) {
    return res.status(400).send("Campos obrigatórios!");
  }

  try {
    const query = `
      SELECT 
        d.nome AS disciplina,
        d.carga_horaria,
        d.dia_semana,
        d.turno,
        p.nome AS professor,
        a.nome AS aluno
      FROM matriculas m
      JOIN alunos a ON m.idaluno = a.idaluno
      JOIN disciplinas d ON m.iddisciplina = d.iddisciplina
      JOIN vinculos v ON m.iddisciplina = v.iddisciplina
      JOIN professores p ON v.idprofessor = p.idprofessor
      WHERE m.ativo = 'SIM'
      AND m.iddisciplina BETWEEN ? AND ?
      ORDER BY d.nome, p.nome, a.nome
    `;

    const [rows] = await pool.query(query, [disciplinaInicial, disciplinaFinal]);

    if (rows.length === 0) {
      return res.status(400).send("Nenhum registro encontrado para as disciplinas informadas.");
    }

    // Organiza os dados em grupos para renderização
    const groupedData = rows.reduce((acc, row) => {
      const key = `${row.disciplina}-${row.professor}`;
      if (!acc[key]) {
        acc[key] = { disciplina: row.disciplina, dia_semana: row.dia_semana, turno: row.turno, professor: row.professor, alunos: [] };
      }
      acc[key].alunos.push(row.aluno);
      return acc;
    }, {});

    // Renderiza a página de visualização com os dados agrupados
    res.render("listaPresenca/visualizar", { groupedData });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao gerar a lista.");
  }
};


exports.visualizarRelatorio = async (req, res) => {
  try {

    // Certifica-se de que a lista foi enviada no corpo da requisição
    const lista = req.body.lista ? JSON.parse(req.body.lista) : null;

    if (!lista || lista.length === 0) {
      return res.status(400).send("Erro: Nenhuma lista foi enviada para visualizar.");
    }

    // Renderiza a página com os dados
    res.render("listaPresenca/relatorio", { lista });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao exibir o relatório.");
  }
};

exports.exportarPDF = async (req, res) => {
  try {
    const lista = req.body.lista ? JSON.parse(req.body.lista) : null;

    if (!lista || Object.keys(lista).length === 0) {
      return res.status(400).send("Erro: Nenhuma lista foi enviada.");
    }

    const fileName = `ListaPresenca_${Date.now()}.pdf`;
    const downloadsPath = path.join(os.homedir(), "Downloads", fileName);

    const doc = new PDFDocument({ margin: 20, size: "A4", layout: "portrait" });
    doc.pipe(fs.createWriteStream(downloadsPath));

    // Caminho do logotipo
    const logoPath = path.join(__dirname, "../public/images/logoCasaMusica.png");

    // Define o mês e ano atuais automaticamente
    const dataAtual = new Date();
    const nomeMes = dataAtual.toLocaleString("pt-BR", { month: "long" }).toUpperCase();
    const anoAtual = dataAtual.getFullYear();

    Object.values(lista).forEach((group, index) => {
      // Adiciona nova página se não for o primeiro grupo
      if (index > 0) {
        doc.addPage();
      }

      // Logotipo no topo
      doc.image(logoPath, 30, 20, { width: 100, height: 50 });
      doc.font("Helvetica-Bold").fontSize(11).text(``, 350, 40, { align: "right" });

      doc.moveDown(2);

      // Ajustando largura da grade do cabeçalho
      const startX = 30;
      let startY = doc.y + 5;
      const colWidths = [150, 150, 100]; // Mantendo a largura correta do cabeçalho
      const rowHeight = 23;

      // **Pegando o dia da semana e turno corretamente**
      const diaSemana = group.dia_semana ? group.dia_semana.toUpperCase() : "NÃO INFORMADO";
      const turno = group.turno ? group.turno.toUpperCase() : "NÃO INFORMADO";

      // Cabeçalho (Grade para Informações)
      const headerData = [
        ["ARTE EDUCADOR:", group.professor.toUpperCase(), "MÊS:", `${nomeMes} / ${anoAtual}`],
        ["MODALIDADE:", group.disciplina.toUpperCase(), "DIA / PERÍODO:", `${diaSemana} / ${turno}`],
        ["EQUIPAMENTO CULTURAL:", "CASA DA MÚSICA", "LINGUAGEM:", group.disciplina.toUpperCase()]
      ];

      headerData.forEach((row) => {
        let xPos = startX;
        row.forEach((cell, cellIndex) => {
          let width = colWidths[cellIndex % colWidths.length];
          doc.rect(xPos, startY, width, rowHeight).stroke();
          doc.font("Helvetica-Bold").fontSize(9).fillColor("black").text(cell, xPos + 5, startY + 6, { width: width - 10, align: "left" });
          xPos += width;
        });
        startY += rowHeight;
      });

      doc.moveDown(1);

      // Criando a grade de assinaturas com mesmo tamanho do cabeçalho
      const signatureStartY = startY; // original - const signatureStartY = startY + 10;
      const signatureTotalWidth = colWidths.reduce((a, b) => a + b, 0); // Largura total do cabeçalho
      const signatureColWidth = signatureTotalWidth / 2; // Divide ao meio
      const signatureRowHeight = rowHeight * 2.5; // Ajustando para incluir 2 linhas em branco

      // Desenhando as caixas das assinaturas
      doc.rect(startX, signatureStartY, signatureColWidth, signatureRowHeight).stroke(); // Box do oficineiro
      doc.rect(startX + signatureColWidth, signatureStartY, signatureColWidth, signatureRowHeight).stroke(); // Box do coordenador

      // Adicionando espaço em branco para assinaturas
      const blankSpaceY = signatureStartY + rowHeight; // Deixa espaço acima da assinatura
      doc.font("Helvetica").fontSize(9).fillColor("black");

      // Texto das assinaturas centralizado na parte inferior das caixas
      doc.text("ASSINATURA DO OFICINEIRO", startX, blankSpaceY + rowHeight, { width: signatureColWidth, align: "center" });
      doc.text("ASSINATURA DO COORDENADOR", startX + signatureColWidth, blankSpaceY + rowHeight, { width: signatureColWidth, align: "center" });

      startY = signatureStartY + signatureRowHeight + 10; // Atualiza a posição para a próxima seção

      // ** Ajustando a grade dos alunos para ter o mesmo tamanho da grade do cabeçalho **
      const studentTableStartY = startY;
      const studentColWidths = [35, 230, 80, 80, 124]; // Adicionando PRESENÇA 3

      // Cabeçalho da Tabela de Alunos
      doc.rect(startX, studentTableStartY, studentColWidths.reduce((a, b) => a + b), rowHeight).fill("#ddd").stroke();
      doc.fillColor("black").font("Helvetica-Bold").fontSize(9);
      doc.text("Nº", startX + 8, studentTableStartY + 3);
      doc.text("NOME DO(A) ALUNO(A)", startX + studentColWidths[0] + 8, studentTableStartY + 6);
      doc.text("01/" + `${nomeMes.substring(0,3)}`, startX + studentColWidths[0] + studentColWidths[1] + 8, studentTableStartY + 6);
      doc.text("08/" + `${nomeMes.substring(0,3)}`, startX + (studentColWidths[0] - 8) + studentColWidths[1] + studentColWidths[2] + 3, studentTableStartY + 6);
      doc.text("15/" + `${nomeMes.substring(0,3)}`, startX + (studentColWidths[0] - 18) + studentColWidths[1] + studentColWidths[2] + studentColWidths[3] + 3, studentTableStartY + 6);
      doc.text("21/" + `${nomeMes.substring(0,3)}`, startX + (studentColWidths[0]) + studentColWidths[1] + studentColWidths[2] + studentColWidths[3] + 55, studentTableStartY + 6);

      let studentStartY = studentTableStartY + rowHeight;

      // Preenche os alunos na tabela
      group.alunos.forEach((aluno, alunoIndex) => {
        // Desenha as células da linha
        doc.rect(startX, studentStartY, studentColWidths.reduce((a, b) => a + b), rowHeight).stroke();
        doc.font("Helvetica").fontSize(9).fillColor("black").text(`${alunoIndex + 1}`, startX + 8, studentStartY + 6);
        doc.text(aluno.toUpperCase(), startX + studentColWidths[0] + 8, studentStartY + 6, { width: studentColWidths[1] - 10 });
        doc.text("", startX + studentColWidths[0] + studentColWidths[1] + 8, studentStartY + 6);
        doc.text("", startX + studentColWidths[0] + studentColWidths[1] + studentColWidths[2] + 8, studentStartY + 6);
        doc.text("", startX + studentColWidths[0] + studentColWidths[1] + studentColWidths[2] + studentColWidths[3] + 8, studentStartY + 6);
        studentStartY += rowHeight;
      });

      doc.moveDown(2);
    });

    doc.end();

    // Redireciona o usuário após gerar o PDF
    res.redirect("/lista-presenca");
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao gerar o PDF.");
  }
};
