const disciplinaProfessorModel = require('../models/disciplinaProfessorModel');

exports.renderFiltroDisProf = (req, res) => {
    res.render('filtro-relatorio-disciplina-professor');
  };
 

exports.gerarRelatorioDisProf = async (req, res) => {
    try {
        const { disciplinaInicial, disciplinaFinal } = req.body;

        // Busca alunos no intervalo especificado
        const registros = await disciplinaProfessorModel.getDisciplinaProfessor(disciplinaInicial, disciplinaFinal);

        // Conta o número de disciplinas VS professores
        const totalDisciplinaProfessor = registros.length;

        // Verifica se encontrou disciplinas e passa a mensagem apropriada
        if (registros.length > 0) {
            res.render('relatorioDisProf', { registros, mensagem: null, totalDisciplinaProfessor });
 
        } else {
            res.render('relatorioDisProf', { registros: [], mensagem: 'Nenhuma disciplina vs professor encontrado no intervalo especificado.', totalDisciplinaProfessor: 0 });
        }
    } catch (error) {
        console.error('Erro ao gerar relatório de disciplinas VS professor:', error.message);
        res.status(500).send('Erro interno no servidor');
    }
};
