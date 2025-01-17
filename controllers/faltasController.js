const pool = require('../models/db'); // Certifique-se de configurar a conexão com o MySQL
const { format } = require('date-fns');
const { getAlunoName, getProfessorName, getDisciplinaName } = require('../utils/formartarDados');

// Página inicial - listar faltas
exports.listarFaltas =  async (req, res) => {
  try {
    const [faltas] = await pool.query('SELECT * FROM faltas');
    res.render('faltas', { faltas });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao listar faltas');

  }
};
  
  // Inserir faltas
  exports.inserirFalta = async (req, res) => {
    const { aluno_id, disciplina_id, professor_id, data_falta, mes_falta, ano_falta, falta, obs } = req.body;
  
    try {
       await pool.query(`INSERT INTO faltas (aluno_id, professor_id, disciplina_id, data_falta, mes_falta, ano_falta, falta, obs) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [aluno_id, professor_id, disciplina_id, data_falta, mes_falta, ano_falta, falta, obs]);
       res.redirect('/faltas');
    } catch (err) {
      console.error(err);
      res.status(500).send('Erro ao inserir falta');
    }  
  };
  
  
  // Atualizar faltas
  exports.atualizarFalta =  async (req, res) => {
    const { idfalta } = req.params; // Obtém o ID da URL
    const{ mes_falta, ano_falta, data_falta, falta, obs } = req.body;
    try {
  
      await pool.query(`UPDATE faltas SET mes_falta = ?, ano_falta = ?, data_falta = ?, falta = ?, obs = ? WHERE idfalta = ?`, [mes_falta, ano_falta, data_falta, falta, obs, idfalta]);
      res.redirect('/faltas');
  
    } catch (err) {
      console.error(err);
      res.status(500).send('Erro ao atualizar falta');

    }
  };
  
  
  // Excluir faltas
  exports.excluirFalta = async (req, res) => {

    const { idfalta } = req.params; // Obtém o ID da URL
    try {
      await pool.query(`DELETE FROM faltas WHERE idfalta = ?`, [idfalta]);
      res.redirect('/faltas');
      
    } catch (err) {
      console.error(err);
      res.status(500).send('Erro ao excluir falta');
  
   }
  };  
  
  
// Função para renderizar a página de faltas com os dados formatados.
exports.renderFaltasPage = async (req, res) => {

  try {
      const [faltas] = await pool.query('SELECT * FROM faltas'); 
  
      for (let falta of faltas) {

          falta.aluno_nome = `${falta.aluno_id}- ${await getAlunoName(falta.aluno_id)}`;

          falta.professor_nome = `${falta.professor_id}- ${await getProfessorName(falta.professor_id)}`;

          falta.disciplina_nome = `${falta.disciplina_id}- ${await getDisciplinaName(falta.disciplina_id)}`;

          falta.data_falta_formatada = format(new Date(falta.data_falta), 'dd/MM/yyyy'); // Formata a data.
      }
      res.render('faltas', { faltas }); 
  } catch (error) {
      console.error('Erro ao renderizar a página de faltas:', error);
      res.status(500).send('Erro ao carregar a página de faltas');
  }
};


