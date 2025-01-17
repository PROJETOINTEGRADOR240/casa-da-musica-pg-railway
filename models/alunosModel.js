const db = require('../models/db'); // Ajuste o caminho se necessário

exports.getAlunos = async (alunoInicial, alunoFinal) => {
    const query = `
        SELECT idaluno, nome, telefone, email
        FROM alunos
        WHERE idaluno BETWEEN ? AND ?
        ORDER BY nome ASC
    `;
    const [results] = await db.execute(query, [alunoInicial, alunoFinal]);
    return results;
};

