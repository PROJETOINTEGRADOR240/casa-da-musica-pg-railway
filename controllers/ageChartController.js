const db = require('../models/db');

exports.generateBarChartPage = async (req, res) => {
    
    try {
        // Consultar dados da tabela alunos
        const result = await db.query(`
            SELECT idade, sexo 
            FROM alunos 
            WHERE sexo IN ('M', 'm', 'Masculino', 'masculino', 'F', 'f', 'Feminino', 'feminino')
        `);
        const rows = result.rows;
        // Filtrar e calcular médias
        const homens = rows.filter(row => ['M', 'm', 'Masculino', 'masculino'].includes(row.sexo));
        const mulheres = rows.filter(row => ['F', 'f', 'Feminino', 'feminino'].includes(row.sexo));
        
        const mediaHomens = homens.reduce((sum, item) => sum + item.idade, 0) / (homens.length || 1);
        const mediaMulheres = mulheres.reduce((sum, item) => sum + item.idade, 0) / (mulheres.length || 1);

        // Dados para o gráfico
        const chartData = {
            labels: ['Homens', 'Mulheres'],
            datasets: [
                {
                    label: '',
                    data: [mediaHomens, mediaMulheres],
                    backgroundColor: ['#007bff', '#ff5733'],
                },
            ],
        };

        // Renderizar a página
        res.render('barChart', { chartData });
    } catch (error) {
        console.error('Erro ao gerar gráfico:', error);
        res.status(500).send('Erro ao carregar gráfico.');
    }
};
