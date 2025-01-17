const professoresModel = require('../models/professoresModel');

exports.renderFiltroPro = (req, res) => {
    res.render('filtro-relatorio-professor');
  };
 

exports.gerarRelatorioPro = async (req, res) => {
    try {
        const { professorInicial, professorFinal } = req.body;

        // Busca alunos no intervalo especificado
        const professores = await professoresModel.getProfessores(professorInicial, professorFinal);

        // Conta o número de professores
        const totalProfessores = professores.length;

        // Verifica se encontrou professores e passa a mensagem apropriada
        if (professores.length > 0) {
            res.render('relatorioPro', { professores, mensagem: null, totalProfessores });
 
        } else {
            res.render('relatorioPro', { professores: [], mensagem: 'Nenhum professor encontrado no intervalo especificado.', totalProfessores: 0 });
        }
    } catch (error) {
        console.error('Erro ao gerar relatório de professores:', error.message);
        res.status(500).send('Erro interno no servidor');
    }
};
