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
        await pool.query(`INSERT INTO professores (nome, cpf_cnpj, telefone, email, data_nasc, idade, sexo, genero, cor,cep,  endereco, numero, bairro, cidade, estado, complemento, obs) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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

    await pool.query(`UPDATE professores SET nome = ?, cpf_cnpj = ?, telefone = ?, email = ?, data_nasc = ?, idade = ?,
    sexo = ?, genero = ?, cor = ?, cep = ?, endereco = ?, numero = ?, bairro = ?, cidade = ?, estado = ?, complemento = ?, obs = ? WHERE idprofessor = ?`,
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
      await pool.query(`DELETE FROM professores WHERE idprofessor = ?`, [idprofessor]);
      res.redirect('/professores');
      
    } catch (err) {
      console.error(err);
      res.status(500).send('Erro ao excluir professor');
    }
};
