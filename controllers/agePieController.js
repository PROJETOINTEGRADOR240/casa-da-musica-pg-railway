const db = require('../models/db'); // Conexão ao MySQL

exports.getPieChart = async (req, res) => {
    try {
        // Consulta ao banco
        const [rows] = await db.query('SELECT sexo, idade FROM alunos');

        // Inicializar contadores
        const totalMasculino = rows.filter(r => /Masculino/i.test(r.sexo)).length;
        const totalFeminino = rows.filter(r => /Feminino/i.test(r.sexo)).length;

        const faixas = {
            masculino: [0, 0, 0, 0], // Faixas: 5-21, 21-41, 41-61, 61-81
            feminino: [0, 0, 0, 0],
        };

        rows.forEach(row => {
            const idade = row.idade;
            if (/Masculino/i.test(row.sexo)) {
                if (idade >= 5 && idade < 21) faixas.masculino[0]++;
                if (idade >= 21 && idade < 41) faixas.masculino[1]++;
                if (idade >= 41 && idade < 61) faixas.masculino[2]++;
                if (idade >= 61 && idade < 81) faixas.masculino[3]++;
            }
            if (/Feminino/i.test(row.sexo)) {
                if (idade >= 5 && idade < 21) faixas.feminino[0]++;
                if (idade >= 21 && idade < 41) faixas.feminino[1]++;
                if (idade >= 41 && idade < 61) faixas.feminino[2]++;
                if (idade >= 61 && idade < 81) faixas.feminino[3]++;
            }
        });

        // Calcular percentuais
        const percentuais = {
            masculino: faixas.masculino.map(f => ((f / totalMasculino) * 100).toFixed(2)),
            feminino: faixas.feminino.map(f => ((f / totalFeminino) * 100).toFixed(2)),
        };

        // Dados do gráfico
        const chartData = {
            labels: ['5-21', '21-41', '41-61', '61-81'],
            datasets: [
                {
                    label: 'Masculino (%)',
                    data: percentuais.masculino,
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
                },
                {
                    label: 'Feminino (%)',
                    data: percentuais.feminino,
                    backgroundColor: ['#FF9AA2', '#FFB347', '#FFD700', '#D3D3D3'],
                },
            ],
        };

        // Renderizar a página com os dados
              
        res.render('pieChart', { chartData, date: new Date().toISOString() });


    } catch (error) {
        console.error('Erro ao gerar gráfico:', error);
        res.status(500).send('Erro no servidor.');
    }
};
