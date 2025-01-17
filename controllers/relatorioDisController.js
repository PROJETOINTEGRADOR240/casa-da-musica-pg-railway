const disciplinasModel = require('../models/disciplinasModel');

exports.renderFiltroDis = (req, res) => {
    res.render('filtro-relatorio-disciplina');
  };
 

exports.gerarRelatorioDis = async (req, res) => {
    try {
        const { disciplinaInicial, disciplinaFinal } = req.body;

        // Busca alunos no intervalo especificado
        const disciplinas = await disciplinasModel.getDisciplinas(disciplinaInicial, disciplinaFinal);

        // Conta o número de disciplinas
        const totalDisciplinas = disciplinas.length;

        // Verifica se encontrou disciplinas e passa a mensagem apropriada
        if (disciplinas.length > 0) {
            res.render('relatorioDis', { disciplinas, mensagem: null, totalDisciplinas });
 
        } else {
            res.render('relatorioDis', { disciplinas: [], mensagem: 'Nenhuma disciplina encontrada no intervalo especificado.', totalDisciplinas: 0 });
        }
    } catch (error) {
        console.error('Erro ao gerar relatório de disciplinas:', error.message);
        res.status(500).send('Erro interno no servidor');
    }
};
