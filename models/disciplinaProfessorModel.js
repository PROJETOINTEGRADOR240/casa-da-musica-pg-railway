const db = require('../models/db'); // Ajuste o caminho se necessário

exports.getDisciplinaProfessor = async (disciplinaInicial, disciplinaFinal) => {
    const query = `
  SELECT 
    v.iddisciplina,
    d.nome AS disciplina_nome,
    d.carga_horaria,
    d.turno,
    d.dia_semana,
    d.hora_aula_inicio,
    d.hora_aula_fim,
    v.idprofessor,
    p.nome AS professor_nome
FROM vinculos v
JOIN disciplinas d ON v.iddisciplina = d.iddisciplina
JOIN professores p ON v.idprofessor = p.idprofessor
WHERE v.iddisciplina BETWEEN 1 AND 100
ORDER BY d.nome;  
    `;

    const [results] = await db.execute(query, [disciplinaInicial, disciplinaFinal]);
    return results;
};
