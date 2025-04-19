const db = require('../models/db'); // Configuração do banco de dados

exports.generateGenderChart = async (req, res) => {
    try {
        // Consulta ao banco de dados para obter os dados de gênero
        const [rows] = await db.query(`
            SELECT sexo, COUNT(*) as quantidade
            FROM alunos
            GROUP BY sexo
        `);

        // Processamento dos dados
        const total = rows.reduce((sum, row) => sum + row.quantidade, 0);
        const masculino = rows.find(row => row.sexo === 'Masculino')?.quantidade || 0;
        const feminino = rows.find(row => row.sexo === 'Feminino')?.quantidade || 0;

        const percentualMasculino = ((masculino / total) * 100).toFixed(2);
        const percentualFeminino = ((feminino / total) * 100).toFixed(2);

        // Dados para o gráfico
        const chartData = {
            labels: ['Masculino', 'Feminino'],
            datasets: [
                {
                    label: 'Quantidade',
                    data: [masculino, feminino],
                    backgroundColor: ['#4CAF50', '#FFC107']

                },
                {
                    label: 'Percentual (%)',
                    data: [percentualMasculino, percentualFeminino],
                    backgroundColor: ['#2196F3', '#E91E63']
                }
            ]
        };

        // Renderizar a página do gráfico
        //res.render('genderChart', { chartData });
        res.render('genderChart', { chartData, date: new Date().toISOString() });


    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao gerar gráfico de Sexo.');
    }
};
