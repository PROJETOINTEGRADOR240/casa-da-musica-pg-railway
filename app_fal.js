const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require("path")
const db = require('./db'); // Importa o módulo db configurado acima
const { format } = require('date-fns');


// Permitindo o uso de JSON
app.use(express.json());

const port = 3000;
const rotina = ('/faltas')

// Configuração do body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Configuração do EJS e Bootstrap
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', './views');


// Página inicial - listar faltas
app.get('/', async (req, res) => {
  try {
    const [sql] = await db.query('SELECT * FROM faltas');
    res.render('faltas', { faltas: sql });
  } catch (error) {
    console.error('Erro ao listar faltas:', error);

  }
});

// Inserir faltas
app.post('/add', async (req, res) => {

  try {
    const { aluno_id, disciplina_id, professor_id, data_falta, mes_falta, ano_falta, falta, obs } = req.body;
    const [sql] = await db.query(`INSERT INTO faltas (aluno_id, professor_id, disciplina_id, data_falta, mes_falta, ano_falta, falta, obs, idaluno, iddisciplina, idprofessor) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, 1, 1)`, [aluno_id, professor_id, disciplina_id, data_falta, mes_falta, ano_falta, falta, obs]);
    
  } catch (error) {
    console.error('Erro ao inserir falta: ', error);
  } finally {
    res.redirect('/faltas');
  }

});


// Atualizar faltas
app.post('/update/:idfalta', async (req, res) => {
  try {

    const { idfalta } = req.params;
    const{ mes_falta, ano_falta, data_falta, falta, obs } = req.body;
    const [sql] =  await db.query(`UPDATE faltas SET mes_falta = ?, ano_falta = ?, data_falta = ?, falta = ?, obs = ? WHERE idfalta = ?`, [mes_falta, ano_falta, data_falta, falta, obs, idfalta]);


  } catch (error) {
    console.error('Erro ao atualizar falta: ', error);

  } finally {
    res.redirect('/faltas');
  }

});

// Excluir faltas
app.get('/delete/:idfalta',  async (req, res) => {
  try {
    const { idfalta } = req.params;
    const [sql] = await db.query(`DELETE FROM faltas WHERE idfalta = ?`, [idfalta]);

  } catch (error) {
    console.error('Erro ao excluir falta:', error);
  } finally {
    res.redirect('/faltas');
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

app.get('/faltas', async(req, res) => {
try {
    const [faltas] = await db.query('SELECT * FROM faltas');
  

    // Mapeia cada nota para substituir os IDs pelos nomes
    for (let falta of faltas) {

      falta.aluno_nome = (falta.aluno_id) + '-' + await getAlunoName(falta.aluno_id);
      falta.professor_nome = (falta.professor_id) + '-' + await getProfessorName(falta.professor_id);
      falta.disciplina_nome = (falta.disciplina_id) + '-' + await getDisciplinaName(falta.disciplina_id);
      falta.data_falta_data = format(new Date(falta.data_falta), 'dd/MM/yyyy'); // fomatar data na pagina 

    }

    res.render('faltas', { faltas }); 
  } catch (error) {
    console.error("Erro ao renderizar a página de faltas:", error);

  }
});
