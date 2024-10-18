const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Configuração do body-parser
app.use(bodyParser.urlencoded({ extended: true }));

// Configuração do banco de dados
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', 
  password: '', 
  database: 'casadamusica'
});

// Conectar ao banco de dados
db.connect((err) => {
  if (err) {
    console.log('Erro ao conectar ao banco de dados:', err);
  } else {
    console.log('Conectado ao banco de dados MySQL.');
  }
});

// Configuração do EJS e Bootstrap
app.set('view engine', 'ejs');
app.use(express.static('public'));


// Página inicial - listar professores
app.get('/', (req, res) => {
  let sql = 'SELECT * FROM professores';
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.render('professores', { professores: results });
  });
});

// Inserir professor
app.post('/add', (req, res) => {
  const {  nome, cpf_cnpj, telefone, email, data_nasc, idade, sexo, cor, cep,
          endereco, numero, bairro, cidade, estado, complemento, obs } = req.body;
  const sql = `INSERT INTO professores (nome, cpf_cnpj, telefone, email, data_nasc, idade, sexo, cor,cep,         endereco, numero, bairro, cidade, estado, complemento, obs) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  db.query(sql, [nome, cpf_cnpj, telefone, email, data_nasc, idade, sexo, cor, cep,
                endereco, numero, bairro, cidade, estado, complemento, obs], (err, result) => {
    if (err) throw err;
    res.redirect('/');
  });
});




// Atualizar professor
app.post('/update/:idprofessor', (req, res) => {
  const { idprofessor } = req.params;
  const { nome, cpf_cnpj, telefone, email, data_nasc, idade, sexo, cor, cep,
          endereco, numero, bairro, cidade, estado, complemento, obs } = req.body;

  const sql = `UPDATE professores SET nome = ?, cpf_cnpj = ?, telefone = ?, email = ?, data_nasc = ?, idade = ?,
               sexo = ?, cor = ?, cep = ?, endereco = ?, numero = ?, bairro = ?, cidade = ?, estado = ?, complemento = ?, obs = ? WHERE idprofessor = ?`;
  db.query(sql, [nome, cpf_cnpj, telefone, email, data_nasc, idade, sexo, cor, cep,
                 endereco, numero, bairro, cidade, estado, complemento, obs, idprofessor], (err, result) => {
  if (err) throw err;
    res.redirect('/');
  });
});

// Excluir professor
app.get('/delete/:idprofessor', (req, res) => {
  const { idprofessor } = req.params;
  const sql = `DELETE FROM professores WHERE idprofessor = ?`;
  db.query(sql, [idprofessor], (err, result) => {
    if (err) throw err;
    res.redirect('/');
  });
});


// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
