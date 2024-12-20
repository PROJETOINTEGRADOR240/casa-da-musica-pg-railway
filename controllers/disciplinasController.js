const pool = require('../models/db'); ;
const router = require('../routes/disciplinasRoutes');


// Página inicial - listar disciplinas
exports.listarDisciplinas =  async (req, res) => {
  try {
    const [disciplinas] = await pool.query('SELECT * FROM disciplinas');
    res.render('disciplinas', { disciplinas });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao listar disciplinas');

  }
};

// Inserir disciplina
exports.inserirDisciplina = async (req, res) => {
  const { nome, carga_horaria, turno, dia_semana, obs } = req.body;
  
  try {
    await pool.query(`INSERT INTO disciplinas (nome, carga_horaria, turno, dia_semana, obs) VALUES (?, ?, ?, ?, ?)`, [nome, carga_horaria, turno, dia_semana, obs]);
    res.redirect('/disciplinas');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao inserir disciplina');
  }  

};

// Atualizar disciplina
exports.atualizarDisciplina =  async (req, res) => {
  const { iddisciplina } = req.params;
  const { nome, carga_horaria, turno, dia_semana, obs } = req.body;

  try {

  await pool.query(`UPDATE disciplinas SET nome = ?, carga_horaria = ?, turno = ?, dia_semana = ?, obs = ? WHERE iddisciplina = ?`,
  [nome, carga_horaria, turno, dia_semana, obs, iddisciplina]); 
  res.redirect('/disciplinas');

  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao atualizar disciplina');
  }
};

// Excluir disciplina 

  exports.excluirDisciplina = async (req, res) => {
      const { iddisciplina } = req.params; 

      try {
        await pool.query(`DELETE FROM disciplinas WHERE iddisciplina = ?`, [iddisciplina]);
        res.redirect('/disciplinas');
        
      } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao excluir disciplina');
      }
  };
