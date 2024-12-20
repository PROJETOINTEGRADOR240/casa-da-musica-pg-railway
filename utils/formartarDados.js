const pool = require('../models/db'); // Certifique-se de configurar a conexão com o MySQL


async function getAlunoName(aluno_id) {
    const [rows] = await pool.query('SELECT nome FROM alunos WHERE idaluno = ?', [aluno_id]);
    return rows.length ? rows[0].nome : 'Aluno não encontrado';
}

async function getProfessorName(professor_id) {
    const [rows] = await pool.query('SELECT nome FROM professores WHERE idprofessor = ?', [professor_id]);
    return rows.length ? rows[0].nome : 'Professor não encontrado';
}

async function getDisciplinaName(disciplina_id) {
    const [rows] = await pool.query('SELECT nome FROM disciplinas WHERE iddisciplina = ?', [disciplina_id]);
    return rows.length ? rows[0].nome : 'Disciplina não encontrada';
}

module.exports = {
    getAlunoName,
    getProfessorName,
    getDisciplinaName,
};

