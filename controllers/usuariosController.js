const pool = require('../models/db'); ;
const router = require('../routes/usuariosRoutes');

// Página inicial - listar usuarios
exports.listarUsuarios =  async (req, res) => {
  try {
    const [usuarios] = await pool.query('SELECT * FROM usuarios');
    res.render('usuarios', { usuarios });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao listar usuarios');

  }
};

// Inserir usuario
exports.inserirUsuario = async (req, res) => {
  const { nome, email, telefone, nivel, ativo, senha, obs } = req.body;

  try {
    await pool.query("INSERT INTO usuarios (nome, email, telefone, nivel, ativo, senha, obs) VALUES ($1, $2, $3, $4, $5, $6, $7)", [nome, email, telefone, nivel, ativo, senha, obs]);
    res.redirect('/usuarios');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao inserir usuario');
  }  

};

// Atualizar usuario
exports.atualizarUsuario =  async (req, res) => {
  
  const { nome, email, telefone, nivel, senha, obs, idusuario  } = req.body;
  const ativo = req.body['edit-ativo']; // O valor será "SIM" ou "NÃO"

  try {
    
    await pool.query("UPDATE usuarios SET nome = $8, email = $9, telefone = $10, nivel = $11, ativo = $12, senha = $13, obs = $14 WHERE idusuario = $15",
      [nome, email, telefone, nivel, ativo, senha, obs, idusuario]); 
    res.redirect('/usuarios');

  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao atualizar usuario');
  }
};

// Excluir usuario 
exports.excluirUsuario = async (req, res) => {
    const { idusuario } = req.params; 

    try {
      await pool.query("DELETE FROM usuarios WHERE idusuario = $1", [idusuario]);
      res.redirect('/usuarios');
      
    } catch (err) {
      console.error(err);
      res.status(500).send('Erro ao excluir usuario');
    }
};
