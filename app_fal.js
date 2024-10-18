const express = require('express');
const router = express.Router();
const cors = require('cors')
const mysql = require('mysql2');
const bodyParser = require('body-parser');


const app = express();
// Permitindo o uso de JSON
app.use(express.json());
// Habilitando CORS
//app.use(cors());
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

// Dando erro ------------ criar estruturas de pastas ??
//const connection = require('./db');


// Página inicial - listar faltas
app.get('/', (req, res) => {
  let sql = 'SELECT * FROM faltas';
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.render('faltas', { faltas: results });
  });
});

// Inserir faltas
app.post('/add', (req, res) => {
  const { aluno_id, disciplina_id, professor_id, data_falta, mes_falta, ano_falta, falta, obs } = req.body;
  const sql = `INSERT INTO faltas (aluno_id, disciplina_id, professor_id, data_falta, mes_falta, ano_falta, falta, obs, idaluno, iddisciplina, idprofessor) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, 1, 1)`;
  db.query(sql, [aluno_id, disciplina_id, professor_id, data_falta, mes_falta, ano_falta, falta, obs], (err, result) => {
    if (err) throw err;
    res.redirect('/');
  });
});


// Atualizar faltas
app.post('/update/:idfalta', (req, res) => {
  const { idfalta } = req.params;
  const{ aluno_id, disciplina_id, professor_id, mes_falta, ano_falta, data_falta, falta, obs } = req.body;
  const sql = `UPDATE faltas SET aluno_id = ?, disciplina_id = ?, professor_id = ?, mes_falta = ?, ano_falta = ?,data_falta = ?, falta = ?, obs = ? WHERE idfalta = ?`;
  db.query(sql, [aluno_id, disciplina_id, professor_id, mes_falta, ano_falta, data_falta, falta, obs, idfalta], (err, result) => {
  if (err) throw err;
    res.redirect('/');
  });
});


// Excluir nptas
app.get('/delete/:idfalta', (req, res) => {
  const { idfalta } = req.params;
  const sql = `DELETE FROM faltas WHERE idfalta = ?`;
  db.query(sql, [idfalta], (err, result) => {
    if (err) throw err;
    res.redirect('/');
  });
});


/* --------------------------------------------------------------

// Rota para verificar se o aluno existe
router.get('/verificarAluno/:aluno_id', (req, res) => {
  const idaluno = req.params.aluno_id;
  const query = 'SELECT nome FROM alunos WHERE idaluno = ?';

  connection.query(query, [idaluno], (error, results) => {
    if (error) {
      return res.status(500).json({ existe: false, error: 'Erro no banco de dados' });
    }
    if (results.length > 0) {
      res.json({ existe: true, nome: results[0].nome });
    } else {
      res.json({ existe: false });
    }
  });
});


// Rota para verificar se a disciplina existe
router.get('/verificarDisciplina/:disciplina_id', (req, res) => {
  const iddisciplina = req.params.disciplina_id;
  const query = 'SELECT nome FROM disciplina WHERE iddisciplina = ?';

  connection.query(query, [iddisciplina], (error, results) => {
    if (error) {
      return res.status(500).json({ existe: false, error: 'Erro no banco de dados' });
    }
    if (results.length > 0) {
      res.json({ existe: true, nome: results[0].nome });
    } else {
      res.json({ existe: false });
    }
  });
});

module.exports = router;

---------------------------------------- */ 


// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
