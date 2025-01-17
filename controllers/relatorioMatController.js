const alunosMatModel = require('../models/alunosMatModel');

exports.renderMatFiltro = (req, res) => {
    res.render('filtro-relatorio-matridisci');
};

exports.gerarMatRelatorio = async (req, res) => {
    try {
        // Obtém todos os registros do modelo
        const registros = await alunosMatModel.getAlunosMat();

        // Verifica se há registros e os envia diretamente ao template

        res.render('relatorioMat', { registros });
    } catch (error) {
        console.error('Erro ao gerar relatório:', error.message);
        res.status(500).send('Erro interno no servidor');
    }
};
