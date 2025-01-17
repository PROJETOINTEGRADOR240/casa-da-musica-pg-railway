const db = require('../models/db');
const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');
const { DateTime } = require('luxon');

// Função para adicionar cabeçalho
function addHeader(doc, pageNumber) {
    
    const dateTime = DateTime.now().toFormat('dd/MM/yyyy HH:mm:ss');
    const margin = 50; // Margem da esquerda para alinhar o texto de forma adequada
    const pageWidth = doc.page.width;
    const textRightPosition = pageWidth - margin - 100; // Posição para o número da página (ajustada para não ficar esprimida)

    // Adiciona a data/hora alinhada à esquerda e a página à direita
    doc.font('Helvetica-Oblique').fontSize(10)
        .text(`Data/Hora: ${dateTime}`, margin, 30, { align: 'left' })
        .text(`Página: ${pageNumber}`, textRightPosition, 30, { align: 'right' });

    doc.moveDown(2);
}

// Rota POST para processar a geração do relatório
exports.generateAgeReport = async (req, res) => {
    const { ageStart, ageEnd } = req.body;

    try {
        const [rows] = await db.query(
            'SELECT idaluno, nome, idade FROM alunos WHERE idade BETWEEN ? AND ? ORDER BY idade ASC',
            [ageStart, ageEnd]
        );

        if (rows.length === 0) {
            return res.status(404).send('Nenhum aluno encontrado no intervalo de idade especificado.');
        }

        // Nome único para o relatório
        const timestamp = Date.now();
        const fileName = `Relatorio_Idade_${timestamp}.pdf`;
        const filePath = path.join(__dirname, '../public/reports', fileName);

        // Verifique se o diretório de relatórios existe
        const reportsDir = path.dirname(filePath);
        if (!fs.existsSync(reportsDir)) {
            fs.mkdirSync(reportsDir, { recursive: true });
        }

        // Criar o documento PDF
        const doc = new PDFDocument({ margin: 30, size: 'A4' });
        doc.pipe(fs.createWriteStream(filePath));

        let pageNumber = 1; // Contador de páginas
        addHeader(doc, pageNumber); // Adicionar cabeçalho (data/hora e página)

        // Título do Relatório
        const title = `Relatório por Faixa Etária (${ageStart} - ${ageEnd}) anos`;

        // Calcular a posição centralizada para o título
        const titleWidth = doc.widthOfString(title);  // Obtém a largura do título
        const xPosition = (doc.page.width - titleWidth) / 2; // Calcula a posição centralizada

        doc.fontSize(16).text(title, xPosition, doc.y).moveDown(2);

        // Cabeçalhos
        const headers = ['Matrícula', 'Nome', 'Idade'];
        const columnWidths = [100, 300, 100]; // Ajuste das larguras
        let xPositionHeader = 50; // Margem inicial
        const initialY = doc.y;

        doc.fontSize(12).font('Helvetica-Bold');
        headers.forEach((header, index) => {
            doc.text(header, xPositionHeader, initialY, {
                width: columnWidths[index],
                align: 'left',
            });
            xPositionHeader += columnWidths[index] + 20; // Espaçamento entre colunas
        });

        doc.moveDown(0.5); // Espaçamento entre cabeçalhos e dados

        // Dados dos alunos
        doc.font('Helvetica').fontSize(10);
        rows.forEach((row) => {
            xPositionHeader = 50; // Reinicia a posição X
            const currentY = doc.y;

            // Adiciona os dados alinhados com os cabeçalhos
            doc.text(row.idaluno.toString(), xPositionHeader, currentY, { width: columnWidths[0], align: 'left' });
            xPositionHeader += columnWidths[0] + 20;

            doc.text(row.nome, xPositionHeader, currentY, { width: columnWidths[1], align: 'left' });
            xPositionHeader += columnWidths[1] + 20;

            doc.text(row.idade.toString(), xPositionHeader, currentY, { width: columnWidths[2], align: 'left' });

            doc.moveDown(0.5); // Move o cursor para a próxima linha
        });

        // Se a página estiver cheia, adicionar uma nova página com o cabeçalho
        if (doc.y > 700) {
            doc.addPage();
            pageNumber += 1;
            addHeader(doc, pageNumber);
        }

        // Rodapé com quantidade de alunos
        doc.moveDown(2);
        doc.font('Helvetica-Bold').text(`Quantidade de alunos(as): ${rows.length}`, 50, doc.y, { align: 'left' });

        doc.end(); // Finaliza o PDF

        // Redireciona para a tela de opções
        res.render('reportOptionsAge', {
            title: 'Relatório por Faixa Etária',
            downloadUrl: `/reports/download/${fileName}`,
            viewUrl: `/reports/view/${fileName}`,
            backUrl: '/reports/age',
        }); 

    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao gerar o relatório.');
    }
};
