const db = require('../models/db'); // conexão mysql2/promise

exports.getFilteredData = async (filterType) => {
  const query = `
          SELECT d.nome, COUNT(m.idaluno) AS totalAlunos
        FROM disciplinas d
        LEFT JOIN matriculas m ON d.iddisciplina = m.iddisciplina
        WHERE m.ativo = 'SIM'
        GROUP BY d.nome
        ORDER BY totalAlunos ${filterType === 'Maiores' ? 'DESC' : 'ASC'}
        LIMIT 10
  `;

  const [rows] = await db.execute(query);
  return rows;
};
