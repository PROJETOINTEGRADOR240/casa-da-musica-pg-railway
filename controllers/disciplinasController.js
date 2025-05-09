const pool = require('../models/db'); ;
const router = require('../routes/disciplinasRoutes');


// Página inicial - listar disciplinas
exports.listarDisciplinas =  async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM disciplinas');
    res.render('disciplinas', { disciplinas: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao listar disciplinas');

  }
};

// Inserir disciplina
exports.inserirDisciplina = async (req, res) => {
  const { nome, carga_horaria, turno, dia_semana, hora_aula_inicio, hora_aula_fim, obs } = req.body;
  
  try {
    await pool.query("INSERT INTO disciplinas (nome, carga_horaria, turno, dia_semana, hora_aula_inicio, hora_aula_fim, obs) VALUES ($1, $2, $3, $4, $5, $6, $7)", [nome, carga_horaria, turno, dia_semana, hora_aula_inicio, hora_aula_fim, obs]);
    res.redirect('/disciplinas');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao inserir disciplina');
  }  

};

// Atualizar disciplina
exports.atualizarDisciplina =  async (req, res) => {
  const { iddisciplina } = req.params;
  const { nome, carga_horaria, turno, dia_semana, hora_aula_inicio, hora_aula_fim, obs } = req.body;

  try {

  await pool.query("UPDATE disciplinas SET nome = $1, carga_horaria = $2, turno = $3, dia_semana = $4, hora_aula_inicio = $5, hora_aula_fim = $6, obs = $7 WHERE iddisciplina = $8",
  [nome, carga_horaria, turno, dia_semana, hora_aula_inicio, hora_aula_fim, obs, iddisciplina]); 
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
        await pool.query("DELETE FROM disciplinas WHERE iddisciplina = $1", [iddisciplina]);
        res.redirect('/disciplinas');
        
      } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao excluir disciplina');
      }
  };
