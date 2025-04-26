const pool = require('../models/db');
const router = require('../routes/professoresRoutes');


// Página inicial - listar professores
exports.listarProfessores =  async (req, res) => {
    try {
      const [professores] = await pool.query('SELECT * FROM professores');
      res.render('professores', { professores });
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

    await pool.query("UPDATE professores SET nome = $18, cpf_cnpj = $19, telefone = $20, email = $21, data_nasc = $22, idade = $23,
    sexo = $24, genero = $25, cor = $26, cep = $27, endereco = $28, numero = $29, bairro = $30, cidade = $31, estado = $32, complemento = $33, obs = $34 WHERE idprofessor = $35",
    [nome, cpf_cnpj, telefone, email, data_nasc, idade, sexo, genero, cor, cep, endereco, numero, bairro, cidade, estado, complemento, obs, idprofessor]);
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
