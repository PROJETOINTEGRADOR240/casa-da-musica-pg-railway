const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require("path")

const app = express();

// Permitindo o uso de JSON
app.use(express.json());

const port = 3000;


// Configuração do body-parser
app.use(bodyParser.json());
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
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', './views');


// Página inicial - listar notas
app.get('/', (req, res) => {
  let sql = 'SELECT * FROM notas';
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.render('notas', { notas: results });
  });
});

// Inserir notas
app.post('/add', (req, res) => {
  const { aluno_id, disciplina_id, professor_id, data_nota, mes_nota, ano_nota, nota, obs } = req.body;
  const sql = `INSERT INTO notas (aluno_id, disciplina_id, professor_id, data_nota, mes_nota, ano_nota, nota, obs, idaluno, iddisciplina, idprofessor) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, 1, 1)`;
  db.query(sql, [aluno_id, disciplina_id, professor_id, data_nota, mes_nota, ano_nota, nota, obs], (err, result) => {
    if (err) throw err;
    res.redirect('/');
  });
});


// Atualizar notas
app.post('/update/:idnota', (req, res) => {
  const { idnota } = req.params;
  const{ aluno_id, disciplina_id, professor_id, mes_nota, ano_nota, data_nota, nota, obs } = req.body;
  const sql = `UPDATE notas SET aluno_id = ?, disciplina_id = ?, professor_id = ?, mes_nota = ?, ano_nota = ?,data_nota = ?, nota = ?, obs = ? WHERE idnota = ?`;
  db.query(sql, [aluno_id, disciplina_id, professor_id, mes_nota, ano_nota, data_nota, nota, obs, idnota], (err, result) => {
  if (err) throw err;
    res.redirect('/');
  });
});


// Excluir nptas
app.get('/delete/:idnota', (req, res) => {
  const { idnota } = req.params;
  const sql = `DELETE FROM notas WHERE idnota = ?`;
  db.query(sql, [idnota], (err, result) => {
    if (err) throw err;
    res.redirect('/');
  });
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
