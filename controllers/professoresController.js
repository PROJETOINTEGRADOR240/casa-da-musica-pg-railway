const pool = require('../models/db');
const router = require('../routes/professoresRoutes');


// Página inicial - listar professores
exports.listarProfessores =  async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM professores');
      res.render('professores', { professores: result.rows });
    } catch (err) {
      console.error(err);
      res.status(500).send('Erro ao listar professores');
  
    }
  };
  
// Inserir professor
exports.inserirProfessor = async (req, res) => {
  const {  nome, cpf_cnpj, telefone, email, data_nasc, idade, sexo, genero, cor, cep,
          endereco, numero, bairro, cidade, estado, complemento, obs } = req.body;
   try {
        await pool.query("INSERT INTO professores (nome, cpf_cnpj, telefone, email, data_nasc, idade, sexo, genero, cor,cep,  endereco, numero, bairro, cidade, estado, complemento, obs) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)",
        [nome, cpf_cnpj, telefone, email, data_nasc, idade, sexo, genero, cor, cep, endereco, numero, bairro, cidade, estado, complemento, obs]);
        res.redirect('/professores');
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao inserir professor');
    }  

};

// Atualizar professor
exports.atualizarProfessor =  async (req, res) => {
  const { idprofessor } = req.params;
  const { nome, cpf_cnpj, telefone, email, data_nasc, idade, sexo, genero, cor, cep, endereco, numero, bairro, cidade, estado, complemento, obs } = req.body;

  try {
    await pool.query(
      `UPDATE professores 
       SET nome = $1, cpf_cnpj = $2, telefone = $3, email = $4, data_nasc = $5, idade = $6, sexo = $7, genero = $8, cor = $9, 
           cep = $10, endereco = $11, numero = $12, bairro = $13, cidade = $14, estado = $15, complemento = $16, obs = $17 
       WHERE idprofessor = $18`,
      [nome, cpf_cnpj, telefone, email, data_nasc, idade, sexo, genero, cor, cep, endereco, numero, bairro, cidade, estado, complemento, obs, idprofessor]
    );
    res.redirect('/professores');

   } catch (err) {
     console.error(err);
     res.status(500).send('Erro ao atualizar professor');
   }
};

// Excluir professor
exports.excluirProfessor = async (req, res) => {
    const { idprofessor } = req.params; 

    try {
      await pool.query("DELETE FROM professores WHERE idprofessor = $1", [idprofessor]);
      res.redirect('/professores');
      
    } catch (err) {
      console.error(err);
      res.status(500).send('Erro ao excluir professor');
    }
};
