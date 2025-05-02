const pool = require('../models/db'); // Certifique-se de configurar a conexão com o MySQL
const { format } = require('date-fns');
const { getAlunoName, getProfessorName, getDisciplinaName } = require('../utils/formartarDados');

// Página inicial - listar matriculas
exports.listarMatriculas =  async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM matriculas');
    res.render('matriculas', { matriculas: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao listar matriculas');

  }
};
  
  // Inserir Matriculas
  exports.inserirMatricula = async (req, res) => {
    const { idaluno, iddisciplina, idprofessor, data_matricula, ativo, obs } = req.body;
  
    try {
       await pool.query("INSERT INTO matriculas (idaluno,iddisciplina, idprofessor, data_matricula, ativo, obs) VALUES ($1, $2, $3, $4, $5, $6)", [idaluno, iddisciplina, idprofessor, data_matricula, ativo, obs]);

       res.redirect('/matriculas');

      } catch (err) {
        if (err.code === '23505') { // Erro de unicidade no PostgreSQL
          const errorMessage = 'Aluno(a) Disciplina já existe!';
          const result = await pool.query('SELECT * FROM matriculas');
          res.render('matriculas', { matriculas: result.rows, errorMessage });
        } else {
          console.error('Erro ao inserir matrícula', err);
          res.status(500).json({ message: 'Erro no servidor' });
        }
      }
    };
      
  
  // Atualizar matriculas
  exports.atualizarMatricula =  async (req, res) => {
    const { idmatricula } = req.params; // Obtém o ID da URL
  
    const { idaluno, iddisciplina, idprofessor, data_matricula, obs } = req.body;
    const ativo = req.body['edit-ativo']; // O valor será "SIM" ou "NÃO"

    try {
  
      await pool.query("UPDATE matriculas SET idaluno = $1, iddisciplina = $2, idprofessor = $3, data_matricula = $4, ativo = $5, obs = $6 WHERE idmatricula = $7", [idaluno, iddisciplina, idprofessor, data_matricula, ativo, obs, idmatricula]);
      res.redirect('/matriculas');
  
    } catch (err) {
      console.error(err);
      res.status(500).send('Erro ao atualizar matricula');

    }
  };
  
  
  // Excluir nptas
  exports.excluirMatricula = async (req, res) => {

    const { idmatricula } = req.params; // Obtém o ID da URL
    try {
      await pool.query("DELETE FROM matriculas WHERE idmatricula = $1", [idmatricula]);
      res.redirect('/matriculas');
      
    } catch (err) {
      console.error(err);
      res.status(500).send('Erro ao excluir matricula');
  
   }
  };  
  
  
// Função para renderizar a página de faltas com os dados formatados.
exports.renderMatriculasPage = async (req, res) => {

  try {
      const result = await pool.query('SELECT * FROM matriculas'); 
      const matriculas = result.rows;
      
      for (let matricula of matriculas) {

        matricula.aluno_nome = `${matricula.idaluno}- ${await 
          getAlunoName(matricula.idaluno)}`;

          matricula.professor_nome = `${matricula.idprofessor}- ${await getProfessorName(matricula.idprofessor)}`;


          matricula.disciplina_nome = `${matricula.iddisciplina}- ${await getDisciplinaName(matricula.iddisciplina)}`;

          matricula.data_matricula_formatada = format(new Date(matricula.data_matricula), 'dd/MM/yyyy'); // Formata a data.
      }
      res.render('matriculas', { matriculas }); 
  } catch (error) {
      console.error('Erro ao renderizar a página de matriculas:', error);
      res.status(500).send('Erro ao carregar a página de matriculas');
  }
};


