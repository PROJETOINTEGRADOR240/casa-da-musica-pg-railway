const db = require('../models/db'); // Ajuste o caminho se necessário

exports.getDisciplinaProfessor = async (disciplinaInicial, disciplinaFinal) => {
    const query = `
   SELECT 
    v.iddisciplina,
    d.nome AS disciplina_nome,
    v.idprofessor,
    p.nome AS professor_nome
    FROM vinculos v
    JOIN disciplinas d ON v.iddisciplina = d.iddisciplina
    JOIN professores p ON v.idprofessor = p.idprofessor
    WHERE v.iddisciplina BETWEEN ? AND ?
    ORDER BY d.nome;`
    ;
    const [results] = await db.execute(query, [disciplinaInicial, disciplinaFinal]);
    return results;
};
