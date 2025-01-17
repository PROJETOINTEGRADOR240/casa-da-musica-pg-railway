const db = require('../models/db'); // Ajuste o caminho se necessário

exports.getAlunosMat = async () => {
    const query = `
SELECT 
    a.idaluno, 
    a.nome AS aluno_nome, 
    d.iddisciplina, 
    d.nome AS disciplina_nome
FROM 
    matriculas m
JOIN 
    alunos a ON m.idaluno = a.idaluno
JOIN 
    disciplinas d ON m.iddisciplina = d.iddisciplina
WHERE 
    m.ativo = 'SIM'  -- Filtra os registros ativos
    AND m.idaluno IN (
        SELECT 
            idaluno 
        FROM 
            matriculas 
        WHERE 
            ativo = 'SIM'  -- Certifica que estamos considerando matrículas ativas
        GROUP BY 
            idaluno 
        HAVING 
            COUNT(DISTINCT iddisciplina) > 1  -- Contagem de disciplinas distintas por aluno
    )
ORDER BY 
    a.nome, d.nome;
    `;
    const [results] = await db.execute(query);
    return results;
};
