const pool = require('../models/db');
require('dotenv').config();


// Função para buscar nomes com base nos IDs fornecidos
async function fetchNames({ alunoIds, professorIds, disciplinaIds }) {

    try {
        // Consultas para obter os nomes
        const [alunos] = await pool.query(
            'SELECT idaluno, nome FROM alunos WHERE idaluno IN (?)',
            [alunoIds]
        );
        const [professores] = await pool.query(
            'SELECT idprofessor, nome FROM professores WHERE idprofessor IN (?)',
            [professorIds]
        );
        const [disciplinas] = await pool.query(
            'SELECT iddisciplina, nome FROM disciplinas WHERE iddisciplina IN (?)',
            [disciplinaIds]
        );

        // Mapear os resultados
        const alunoMap = alunos.reduce((acc, aluno) => {
            acc[aluno.idaluno] = aluno.nome;
            return acc;
        }, {});

        const professorMap = professores.reduce((acc, professor) => {
            acc[professor.idprofessor] = professor.nome;
            return acc;
        }, {});

        const disciplinaMap = disciplinas.reduce((acc, disciplina) => {
            acc[disciplina.iddisciplina] = disciplina.nome;
            return acc;
        }, {});

        return { alunoMap, professorMap, disciplinaMap };
    } catch (error) {
        console.error('Erro ao buscar nomes:', error);
        throw error;
    }
}

module.exports = { fetchNames };
