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


// Página inicial - listar disciplinas
app.get('/', (req, res) => {
  let sql = 'SELECT * FROM disciplinas';
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.render('disciplinas', { disciplinas: results });
  });
});

// Inserir disciplina
app.post('/add', (req, res) => {
  const {  nome, carga_horaria, turno, dia_semana, obs } = req.body;
  const sql = `INSERT INTO disciplinas (nome, carga_horaria, turno, dia_semana, obs) VALUES (?, ?, ?, ?, ?)`;
  db.query(sql, [nome, carga_horaria, turno, dia_semana, obs], (err, result) => {
    if (err) throw err;
    res.redirect('/');
  });
});



// Atualizar disciplina
app.post('/update/:iddisciplina', (req, res) => {
  const { iddisciplina } = req.params;
  const { nome, carga_horaria, turno, dia_semana, obs } = req.body;

  const sql = `UPDATE disciplinas SET nome = ?, carga_horaria = ?, turno = ?, dia_semana = ?, obs = ? WHERE iddisciplina = ?`;
  db.query(sql, [nome, carga_horaria, turno, dia_semana, obs, iddisciplina], (err, result) => {
  if (err) throw err;
    res.redirect('/');
  });
});

// Excluir disciplina
app.get('/delete/:iddisciplina', (req, res) => {
  const { iddisciplina } = req.params;
  const sql = `DELETE FROM disciplinas WHERE iddisciplina = ?`;
  db.query(sql, [iddisciplina], (err, result) => {
    if (err) throw err;
    res.redirect('/');
  });
});


// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
