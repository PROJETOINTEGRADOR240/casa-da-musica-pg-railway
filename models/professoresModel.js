const db = require('../models/db'); // Ajuste o caminho se necessário

exports.getProfessores = async (professorInicial, professorFinal) => {
    const query = `
SELECT 
    p.idprofessor, 
    p.nome AS professor_nome, 
    p.telefone, 
    p.email,
    d.iddisciplina,
    d.nome AS disciplina_nome
FROM 
    professores p
INNER JOIN 
    vinculos v ON p.idprofessor = v.idprofessor
INNER JOIN 
    disciplinas d ON v.iddisciplina = d.iddisciplina
WHERE 
    p.idprofessor BETWEEN $1 AND $2
ORDER BY 
    p.nome ASC, d.nome ASC;
    `;
    const [results] = await db.execute(query, [professorInicial, professorFinal]);
    return results;
};
