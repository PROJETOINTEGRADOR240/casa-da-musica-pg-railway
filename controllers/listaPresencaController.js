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

    const result = await pool.query(query, [disciplinaInicial, disciplinaFinal]);

    const rows = result.rows;
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


exports.exportarPDF = async (req, res) => {
  try {
    console.log("Iniciando exportarPDF - Corpo da requisição:", req.body);

    if (!req.body || typeof req.body.lista !== "string") {
      console.error("Erro: req.body.lista não é uma string válida ou está ausente", req.body);
      return res.status(400).send("Erro: Dados da lista ausentes ou inválidos.");
    }

    let lista;
    try {
      lista = JSON.parse(req.body.lista);
      console.log("Lista parseada com sucesso:", lista);
    } catch (parseErr) {
      console.error("Erro ao fazer parsing do req.body.lista:", parseErr.message);
      return res.status(400).send("Erro: Formato de dados da lista inválido.");
    }

    if (!lista || Object.keys(lista).length === 0) {
      console.log("Erro: Lista vazia ou não enviada");
      return res.status(400).send("Erro: Nenhuma lista foi enviada.");
    }

    const fileName = `ListaPresenca_${Date.now()}.pdf`;
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Type", "application/pdf");

    const doc = new PDFDocument({ margin: 20, size: "A4", layout: "portrait" });
    doc.pipe(res);

    // Caminho do logotipo (ajuste conforme seu diretório)
    const logoPath = "public/images/LogoCasaMusica.png"; // Exemplo com public
    console.log("Caminho do logotipo:", logoPath);

    if (!fs.existsSync(logoPath)) {
      console.warn("Logotipo não encontrado em:", logoPath);
    }

    const dataAtual = new Date();
    const nomeMes = dataAtual.toLocaleString("pt-BR", { month: "long" }).toUpperCase();
    const anoAtual = dataAtual.getFullYear();

    Object.values(lista).forEach((group, index) => {
      if (index > 0) {
        doc.addPage();
      }

      // Adiciona o logotipo no topo de cada página
      if (fs.existsSync(logoPath)) {
        try {
          doc.image(logoPath, 30, 20, { width: 100, height: 50 });
          console.log(`Logotipo adicionado na página ${index + 1}`);
        } catch (imageErr) {
          console.error("Erro ao adicionar logotipo:", imageErr.message);
          doc.font("Helvetica").fontSize(10).text("Erro ao carregar logotipo", 30, 20);
        }
      } else {
        doc.font("Helvetica").fontSize(10).text("Logotipo não disponível", 30, 20);
      }

      doc.font("Helvetica-Bold").fontSize(11).text("", 350, 40, { align: "right" });
      doc.moveDown(2);

      const startX = 30;
      let startY = doc.y + 5;
      const colWidths = [150, 150, 100];
      const rowHeight = 23;

      const diaSemana = group.dia_semana ? group.dia_semana.toUpperCase() : "NÃO INFORMADO";
      const turno = group.turno ? group.turno.toUpperCase() : "NÃO INFORMADO";

      const headerData = [
        ["ARTE EDUCADOR:", group.professor.toUpperCase(), "MÊS:", `${nomeMes} / ${anoAtual}`],
        ["MODALIDADE:", group.disciplina.toUpperCase(), "DIA / PERÍODO:", `${diaSemana} / ${turno}`],
        ["EQUIPAMENTO CULTURAL:", "CASA DA MÚSICA", "LINGUAGEM:", group.disciplina.toUpperCase()],
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

      const signatureStartY = startY;
      const signatureTotalWidth = colWidths.reduce((a, b) => a + b, 0) + 149;
      const signatureColWidth = signatureTotalWidth / 2;
      const signatureRowHeight = rowHeight * 2.5;

      doc.rect(startX, signatureStartY, signatureColWidth, signatureRowHeight).stroke();
      doc.rect(startX + signatureColWidth, signatureStartY, signatureColWidth, signatureRowHeight).stroke();

      const blankSpaceY = signatureStartY + rowHeight;
      doc.font("Helvetica").fontSize(9).fillColor("black");
      doc.text("ASSINATURA DO OFICINEIRO", startX, blankSpaceY + rowHeight, { width: signatureColWidth, align: "center" });
      doc.text("ASSINATURA DO COORDENADOR", startX + signatureColWidth, blankSpaceY + rowHeight, { width: signatureColWidth, align: "center" });

      startY = signatureStartY + signatureRowHeight + 10;

      const studentTableStartY = startY;
      const studentColWidths = [35, 230, 80, 80, 124];

      doc.rect(startX, studentTableStartY, studentColWidths.reduce((a, b) => a + b), rowHeight).fill("#ddd").stroke();
      doc.fillColor("black").font("Helvetica-Bold").fontSize(9);
      doc.text("Nº", startX + 8, studentTableStartY + 3);
      doc.text("NOME DO(A) ALUNO(A)", startX + studentColWidths[0] + 8, studentTableStartY + 6);
      doc.text("01/" + `${nomeMes.substring(0,3)}`, startX + studentColWidths[0] + studentColWidths[1] + 8, studentTableStartY + 6);
      doc.text("08/" + `${nomeMes.substring(0,3)}`, startX + (studentColWidths[0] - 8) + studentColWidths[1] + studentColWidths[2] + 3, studentTableStartY + 6);
      doc.text("15/" + `${nomeMes.substring(0,3)}`, startX + (studentColWidths[0] - 18) + studentColWidths[1] + studentColWidths[2] + studentColWidths[3] + 3, studentTableStartY + 6);
      doc.text("21/" + `${nomeMes.substring(0,3)}`, startX + (studentColWidths[0]) + studentColWidths[1] + studentColWidths[2] + studentColWidths[3] + 55, studentTableStartY + 6);

      let studentStartY = studentTableStartY + rowHeight;

      group.alunos.forEach((aluno, alunoIndex) => {
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
    console.log("PDF gerado e enviado com sucesso");
  } catch (err) {
    console.error("Erro ao processar exportarPDF:", err.stack);
    res.status(500).send("Erro ao gerar o PDF. Por favor, tente novamente mais tarde.");
  }
};
