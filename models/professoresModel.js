const db = require('../models/db'); // Ajuste o caminho se necessário

exports.getProfessores = async (professorInicial, professorFinal) => {
    const query = `
        SELECT idprofessor, nome, telefone, email
        FROM professores
        WHERE idprofessor BETWEEN ? AND ?
        ORDER BY nome ASC
    `;
    const [results] = await db.execute(query, [professorInicial, professorFinal]);
    return results;
};
