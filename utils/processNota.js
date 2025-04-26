const pool = require('./models/db');
require('dotenv').config();



/**
 * Formata uma data no formato AAAA-MM-DD para DD/MM/AAAA.
 * @param {string} dataISO - Data em formato ISO.
 * @returns {string} - Data formatada em DD/MM/AAAA.
 */
//function formatarData(dataISO) {
//    const [ano, mes, dia] = dataISO.split('-');
 //   return "${dia}/${mes}/${ano}";
//}

//function formatarData(dateString) {
//    const data = new Date(dateString);
//    const dia = String(data.getDate()).padStart(2, '0');
//    const mes = String(data.getMonth() + 1).padStart(2, '0'); // Janeiro é 0
//    const ano = data.getFullYear();
 //   return "${dia}/${mes}/${ano}";
//}

/**
 * Processa uma única nota, buscando nomes e formatando a data.
 * @param {Object} nota - Objeto com dados da nota.
 * @returns {Object} - Objeto com dados complementares e data formatada.
 */
async function processNota(nota) {
    try {
        const [alunoResult] = await pool.query('SELECT nome FROM alunos WHERE idaluno = $1', [nota.aluno_id]);
        const [professorResult] = await pool.query('SELECT nome FROM professores WHERE idprofessor = $1', [nota.professor_id]);
        const [disciplinaResult] = await pool.query('SELECT nome FROM disciplinas WHERE iddisciplina = $1', [nota.disciplina_id]);

        const alunoNome = alunoResult.length > 0 ? alunoResult[0].nome : 'Não encontrado';
        const professorNome = professorResult.length > 0 ? professorResult[0].nome : 'Não encontrado';
        const disciplinaNome = disciplinaResult.length > 0 ? disciplinaResult[0].nome : 'Não encontrado';

        //const dataFormatada = formatarData(nota.data_nota);
        const dataFormatada = formatDate(new Date(nota.data_nota), 'dd/MM/yyyy')
        return {
            idnota: nota.idnota,
            aluno: "${nota.aluno_id} - ${alunoNome}",
        //    aluno: 'mm',
            professor: "${nota.professor_id} - ${professorNome}",
            disciplina: "${nota.disciplina_id} - ${disciplinaNome}",
            data_nota: dataFormatada,
            nota: nota.nota,
        };
    } catch (error) {
        console.error('Erro ao processar nota:', error.message);
        throw error;
    }
}

/**
 * Processa uma lista de notas.
 * @param {Array} notas - Lista de notas.
 * @returns {Array} - Lista de notas processadas.
 */
async function processarNotas(notas) {
    return Promise.all(notas.map(processNota));
}

module.exports = { processNota, processarNotas };

