const alunosModel = require('../models/alunosModel');

exports.renderFiltro = (req, res) => {
    res.render('filtro-relatorio');
  };
 

exports.gerarRelatorio = async (req, res) => {
    try {
        const { alunoInicial, alunoFinal } = req.body;

        // Busca alunos no intervalo especificado
        const alunos = await alunosModel.getAlunos(alunoInicial, alunoFinal);

        // Conta o número de alunos
        const totalAlunos = alunos.length;

        // Verifica se encontrou alunos e passa a mensagem apropriada
        if (alunos.length > 0) {
            res.render('relatorio', { alunos, mensagem: null, totalAlunos });

        } else {
            res.render('relatorio', { alunos: [], mensagem: 'Nenhum aluno encontrado no intervalo especificado.', totalAlunos: 0 });
        }
    } catch (error) {
        console.error('Erro ao gerar relatório:', error.message);
        res.status(500).send('Erro interno no servidor');
    }
};
