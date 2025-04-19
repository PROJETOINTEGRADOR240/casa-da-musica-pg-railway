const db = require('../models/db'); // Ajuste o caminho se necessário

exports.getDisciplinas = async (disciplinaInicial, disciplinaFinal) => {
    const query = `
        SELECT iddisciplina, nome, hora_aula_inicio, hora_aula_fim,carga_horaria, turno, dia_semana
        FROM disciplinas
        WHERE iddisciplina BETWEEN ? AND ?
        ORDER BY nome ASC
    `;
    const [results] = await db.execute(query, [disciplinaInicial, disciplinaFinal]);
    return results;
};
