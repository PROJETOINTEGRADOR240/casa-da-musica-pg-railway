const db = require('../models/db'); // Ajuste o caminho se necessário

exports.getAlunosTax = async () => {
    const query = `
            SELECT 
            a.nome AS aluno_nome, 
            d.nome AS disciplina_nome, 
            COUNT(f.falta) AS total_faltas,
            CASE 
                WHEN COUNT(f.falta) = 2 THEN 'Atenção quantidade de faltas críticas'
                WHEN COUNT(f.falta) >= 3 THEN 'Atenção entrar em contato com o(a) aluno(a)'
                ELSE NULL
            END AS mensagem
        FROM disciplinas d
        INNER JOIN matriculas m ON d.iddisciplina = m.iddisciplina
        INNER JOIN alunos a ON m.idaluno = a.idaluno
        INNER JOIN faltas f ON m.idaluno = f.aluno_id AND m.iddisciplina = f.disciplina_id
        WHERE m.ativo = 'SIM'
        GROUP BY a.nome, d.nome
        HAVING total_faltas >= 2

    `;
    const [results] = await db.execute(query);
    return results;
};