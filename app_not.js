const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require("path");
const db = require('./db'); // Importa o módulo db configurado acima
const { format } = require('date-fns');


// Permitindo o uso de JSON
app.use(express.json());

const port = 3000;
const rotina = ('/notas');

// Configuração do body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Configuração do EJS e Bootstrap
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', './views');


// Página inicial - listar notas
app.get('/', async (req, res) => {
  try {
    const [sql] = await db.query('SELECT * FROM notas');
    res.render('notas', { notas: sql });
  } catch (error) {
    console.error('Erro ao listar notas:', error);

  }
});

// Inserir notas
app.post('/add', async (req, res) => {

  try {
    const { aluno_id, disciplina_id, professor_id, data_nota, mes_nota, ano_nota, nota, obs } = req.body;
    const [sql] = await db.query(`INSERT INTO notas (aluno_id, professor_id, disciplina_id, data_nota, mes_nota, ano_nota, nota, obs, idaluno, iddisciplina, idprofessor) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, 1, 1)`, [aluno_id, professor_id, disciplina_id, data_nota, mes_nota, ano_nota, nota, obs]);
    
  } catch (error) {
    console.error('Erro ao inserir nota: ', error);
  } finally {
    res.redirect('/notas');
  }

});


// Atualizar notas
app.post('/update/:idnota', async (req, res) => {
  try {

    const { idnota } = req.params;
    const{ mes_nota, ano_nota, data_nota, nota, obs } = req.body;
    const [sql] =  await db.query(`UPDATE notas SET mes_nota = ?, ano_nota = ?, data_nota = ?, nota = ?, obs = ? WHERE idnota = ?`, [mes_nota, ano_nota, data_nota, nota, obs, idnota]);


  } catch (error) {
    console.error('Erro ao atualizar nota: ', error);

  } finally {
    res.redirect('/notas');
  }

});


// Excluir nptas
app.get('/delete/:idnota',  async (req, res) => {
  try {
    const { idnota } = req.params;
    const [sql] = await db.query(`DELETE FROM notas WHERE idnota = ?`, [idnota]);

  } catch (error) {
    console.error('Erro ao excluir nota:', error);
  } finally {
    res.redirect('/notas');
  }

});


// Verifica se o aluno existe pelo código
app.get('/verificar-aluno/:aluno_id', async (req, res) => {
  try {

      const aluno_id = req.params.aluno_id;
      const [aluno] = await db.query('SELECT nome FROM alunos WHERE idaluno = ?', [aluno_id]);

      if (aluno.length > 0) {
         res.json({ existe: true, nome: aluno[0].nome });
      } else {
         res.json({ existe: false });
      }
    } catch (error) {
      console.error('Erro ao consultar aluno: bonitão', error);

    }
});

// Verifica se o professor existe pelo código
app.get('/verificar-professor/:professor_id', async (req, res) => {
  try {
    const professor_id = req.params.professor_id;
    const [professor] = await db.query('SELECT nome FROM professores WHERE idprofessor = ?', [professor_id]);

    if (professor.length > 0) {
       res.json({ existe: true, nome: professor[0].nome });
    } else {
       res.json({ existe: false });
    }
  } catch (error) {
    console.error('Erro ao consultar professor:', error);

  }
});

// Verifica se a disciplina existe pelo código
app.get('/verificar-disciplina/:disciplina_id', async (req, res) => {
  try {
    const disciplina_id = req.params.disciplina_id;
    const [disciplina] = await db.query('SELECT nome FROM disciplinas WHERE iddisciplina = ?', [disciplina_id]);

    if (disciplina.length > 0) {
       res.json({ existe: true, nome: disciplina[0].nome });
    } else {
       res.json({ existe: false });
    }

  } catch (error) {
    console.error('Erro ao consultar disciplina:', error);

  }
});


// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}${rotina}`);
});


// ******************** Functions diversas *****************


async function getAlunoName(aluno_id) {
    const [rows] = await db.query('SELECT nome FROM alunos WHERE idaluno = ?', [aluno_id]);
    return rows.length ? rows[0].nome : 'Aluno não encontrado';
}

async function getProfessorName(professor_id) {
  const [rows] = await db.query('SELECT nome FROM professores WHERE idprofessor = ?', [professor_id]);
  return rows.length ? rows[0].nome : 'Professor não encontrado';
}

async function getDisciplinaName(disciplina_id) {
  const [rows] = await db.query('SELECT nome FROM disciplinas WHERE iddisciplina = ?', [disciplina_id]);
  return rows.length ? rows[0].nome : 'Disciplina não encontrada';
}

app.get('/notas', async(req, res) => {
  try {
      const [notas] = await db.query('SELECT * FROM notas'); 
      for (let nota of notas) {

          nota.aluno_nome = (nota.aluno_id) + '-' + await getAlunoName(nota.aluno_id);
          nota.professor_nome = (nota.professor_id) + '-' + await getProfessorName(nota.professor_id);
          nota.disciplina_nome = (nota.disciplina_id) + '-' + await getDisciplinaName(nota.disciplina_id);
          nota.data_nota_data = format(new Date(nota.data_nota), 'dd/MM/yyyy'); // fomatar data na pagina 
      }
      res.render('notas', { notas }); 
    } catch (error) {
      console.error("Erro ao renderizar a página de notas:", error);

    }
});
