const pool = require('../models/db'); // Certifique-se de configurar a conexão com o MySQL
const { format } = require('date-fns');
const { getAlunoName, getProfessorName, getDisciplinaName } = require('../utils/formartarDados');


// Página inicial - listar notas
exports.listarNotas =  async (req, res) => {
    try {
      const [notas] = await pool.query('SELECT * FROM notas');
      res.render('notas', { notas });
    } catch (err) {
      console.error(err);
      res.status(500).send('Erro ao listar notas');

    }
};
  
// Inserir notas
exports.inserirNota = async (req, res) => {
  const { aluno_id, disciplina_id, professor_id, data_nota, mes_nota, ano_nota, nota, obs } = req.body;

  try {
      await pool.query(`INSERT INTO notas (aluno_id, professor_id, disciplina_id, data_nota, mes_nota, ano_nota, nota, obs) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [aluno_id, professor_id, disciplina_id, data_nota, mes_nota, ano_nota, nota, obs]);
      res.redirect('/notas');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao inserir nota');
  }  
};


// Atualizar notas
exports.atualizarNota =  async (req, res) => {
  const { idnota } = req.params; // Obtém o ID da URL
  const{ mes_nota, ano_nota, data_nota, nota, obs } = req.body;
  try {

    await pool.query(`UPDATE notas SET mes_nota = ?, ano_nota = ?, data_nota = ?, nota = ?, obs = ? WHERE idnota = ?`, [mes_nota, ano_nota, data_nota, nota, obs, idnota]);
    res.redirect('/notas');

  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao atualizar nota');

  }
};
  
  
  // Excluir nptas
  exports.excluirNota = async (req, res) => {

    const { idnota } = req.params; // Obtém o ID da URL
    try {
      await pool.query(`DELETE FROM notas WHERE idnota = ?`, [idnota]);
      res.redirect('/notas');
      
    } catch (err) {
      console.error(err);
      res.status(500).send('Erro ao excluir nota');
  
    }
  };

  
// Função para renderizar a página de notas com os dados formatados.
exports.renderNotasPage = async (req, res) => {

  try {
      const [notas] = await pool.query('SELECT * FROM notas'); 

      for (let nota of notas) {

          nota.aluno_nome = `${nota.aluno_id}- ${await getAlunoName(nota.aluno_id)}`;
          nota.professor_nome = `${nota.professor_id}- ${await getProfessorName(nota.professor_id)}`;
          nota.disciplina_nome = `${nota.disciplina_id}- ${await getDisciplinaName(nota.disciplina_id)}`;
          nota.data_nota_formatada = format(new Date(nota.data_nota), 'dd/MM/yyyy'); // Formata a data.
      }
      res.render('notas', { notas }); 
  } catch (error) {
      console.error('Erro ao renderizar a página de notas:', error);
      res.status(500).send('Erro ao carregar a página de notas');
  }
};
