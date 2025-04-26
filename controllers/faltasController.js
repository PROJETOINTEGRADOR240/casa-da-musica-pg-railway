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
       await pool.query("INSERT INTO faltas (aluno_id, professor_id, disciplina_id, data_falta, mes_falta, ano_falta, falta, obs) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)", [aluno_id, professor_id, disciplina_id, data_falta, mes_falta, ano_falta, falta, obs]);

       res.redirect('/faltas');

      } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          const errorMessage = 'Aluno, Professor, Disciplina e Data já existe!';
          const [faltas] = await pool.query('SELECT * FROM faltas');
          res.render('faltas', { faltas, errorMessage });
        } else {  
          console.error('Erro ao inserir falta', err);
          res.status(500).json({ message: 'Erro no servidor' });
        }  
      }
  };
  
  
  
  // Atualizar faltas
  exports.atualizarFalta =  async (req, res) => {
    const { idfalta } = req.params; // Obtém o ID da URL
    const{ mes_falta, ano_falta, data_falta, falta, obs } = req.body;
    try {
  
      await pool.query("UPDATE faltas SET mes_falta = $9, ano_falta = $10, data_falta = $11, falta = $12, obs = $13 WHERE idfalta = $14", [mes_falta, ano_falta, data_falta, falta, obs, idfalta]);
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
      await pool.query("DELETE FROM faltas WHERE idfalta = $1", [idfalta]);
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

          falta.aluno_nome = "${falta.aluno_id}- ${await getAlunoName(falta.aluno_id)}";

          falta.professor_nome = "${falta.professor_id}- ${await getProfessorName(falta.professor_id)}";

          falta.disciplina_nome = "${falta.disciplina_id}- ${await getDisciplinaName(falta.disciplina_id)}";

          falta.data_falta_formatada = format(new Date(falta.data_falta), 'dd/MM/yyyy'); // Formata a data.
      }
      res.render('faltas', { faltas }); 
  } catch (error) {
      console.error('Erro ao renderizar a página de faltas:', error);
      res.status(500).send('Erro ao carregar a página de faltas');
  }
};


