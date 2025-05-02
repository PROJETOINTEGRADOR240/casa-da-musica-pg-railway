const pool = require('../models/db');

// Página inicial - listar alunos
exports.listarAlunos =  async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM alunos');
    res.render('alunos', { alunos: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao listar alunos');

  }
};

// Inserir aluno
exports.inserirAluno = async (req, res) => {
  const {  nome, cpf_cnpj, telefone, email, data_nasc, idade, pcd, sexo, genero, cor, ativo, cpf_cnpj_resp, nome_resp, cep, endereco, numero, bairro, cidade, estado, complemento, obs } = req.body;
   try {
        await pool.query("INSERT INTO alunos (nome, cpf_cnpj, telefone, email, data_nasc, idade, pcd, sexo, genero, cor, ativo, cpf_cnpj_resp, nome_resp, cep, endereco, numero, bairro, cidade, estado, complemento, obs) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)",
        [nome, cpf_cnpj, telefone, email, data_nasc, idade, pcd, sexo, genero, cor, ativo, cpf_cnpj_resp, nome_resp, cep, endereco, numero, bairro, cidade, estado, complemento, obs]);
        res.redirect('/alunos');
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao inserir aluno');
    }  

};

// Atualizar aluno
exports.atualizarAluno =  async (req, res) => {
  const { idaluno } = req.params;
  const { nome, cpf_cnpj, telefone, email, data_nasc, idade, sexo, genero, cor, cpf_cnpj_resp, nome_resp, cep, endereco, numero, bairro, cidade, estado, complemento, obs } = req.body;
  const pcd = req.body['edit-pcd']; // O valor será "SIM" ou "NÃO"
  const ativo = req.body['edit-ativo']; // O valor será "SIM" ou "NÃO"
  try {

    await pool.query("UPDATE alunos SET nome = $22, cpf_cnpj = $23, telefone = $24, email = $25, data_nasc = $26, idade = $27, pcd = $28, sexo = $29, genero = $30, cor = $31, ativo = $32, cpf_cnpj_resp = $33, nome_resp = $34, cep = $35, endereco = $36, numero = $37, bairro = $38, cidade = $39, estado = $40, complemento = $41, obs = $42 WHERE idaluno = $43",
    [nome, cpf_cnpj, telefone, email, data_nasc, idade, pcd, sexo, genero, cor, ativo, cpf_cnpj_resp, nome_resp, cep, endereco, numero, bairro, cidade, estado, complemento, obs, idaluno]);
    res.redirect('/alunos');

  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao atualizar aluno');
  }
};

// Excluir aluno
exports.excluirAluno = async (req, res) => {
  const { idaluno } = req.params; 

  try {
    await pool.query("DELETE FROM alunos WHERE idaluno = $1", [idaluno]);
    res.redirect('/alunos');
    
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao excluir aluno');
  }
};
