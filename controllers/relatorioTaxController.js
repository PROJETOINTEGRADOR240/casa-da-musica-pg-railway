const alunosTaxModel = require('../models/alunosTaxModel');

exports.renderTaxFiltro = (req, res) => {
    res.render('filtro-relatorio-qtdefaltas');
  };


exports.gerarTaxRelatorio = async (req, res) => {

    try {
        const registros = await alunosTaxModel.getAlunosTax();

        registros.forEach(registro => {
            if (registro.quantidade_faltas === 2) {
                registro.idaluno = idaluno
                registro.mensagem = 'Atenção quantidade de faltas críticas';
                registro.cor = 'yellow'; // Amarelo escuro

            } else if (registro.quantidade_faltas >= 3) {
                registro.idaluno = idaluno
                registro.mensagem = 'Atenção entrar em contato com o(a) aluno(a)';
                registro.cor = 'red'; // Vermelho
            }
        });

        res.render('relatorioTax', { registros });
    } catch (error) {
        console.error('Erro ao gerar relatório de qtde de faltas:', error.message);
        res.status(500).send('Erro interno no servidor');
    }
};
