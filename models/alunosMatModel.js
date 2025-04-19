const db = require('../models/db'); // Ajuste o caminho se necessário

exports.getAlunosMat = async () => {
    const query = `
SELECT 
    a.idaluno, 
    a.nome AS aluno_nome, 
    d.iddisciplina, 
    d.nome AS disciplina_nome,
    p.idprofessor,
    p.nome AS professor_nome
FROM 
    matriculas m
JOIN 
    alunos a ON m.idaluno = a.idaluno
JOIN 
    disciplinas d ON m.iddisciplina = d.iddisciplina
JOIN 
    professores p ON m.idprofessor = p.idprofessor
WHERE 
    m.ativo = 'SIM'
    AND m.idaluno IN (
        SELECT 
            idaluno 
        FROM 
            matriculas 
        WHERE 
            ativo = 'SIM'
        GROUP BY 
            idaluno 
        HAVING 
            COUNT(DISTINCT iddisciplina) > 1
    )
ORDER BY 
    a.nome, d.nome;
    `;
    const [results] = await db.execute(query);
    return results;
};
