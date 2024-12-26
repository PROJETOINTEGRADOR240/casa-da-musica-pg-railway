const express = require('express');
const router = express.Router();
const pool = require('../models/db'); // Conexão com o banco de dados

// Função para verificar dependências na tabela `notas`
async function verificarDependencias(tabela, campoTabela, campoNotas, id) {
  console.log("Entrei na rotina de verificação de dependencia - passo 2");
  console.log("Tabela:", tabela);
  console.log("Campo na tabela de origem:", campoTabela);
  console.log("Campo na tabela 'notas':", campoNotas);
  console.log("ID para verificação:", id);

   console.log("As Informaçoes - 1 > " + tabela, campoTabela, campoNotas, id);

  const query = `SELECT COUNT(*) AS count FROM notas WHERE ${campoNotas} = ?`;

  console.log("Query SQL:", query);

  const [rows] = await pool.query(query, [id]);

  console.log("Resultado da consulta:", rows);
  console.log("As Informaçoes - 2 > " + tabela, campoTabela, campoNotas, id, rows[0]);

  return rows[0].count > 0; // Retorna verdadeiro se houver dependências
}

// Rota para excluir aluno
router.post('/alunos/excluir/:id', async (req, res) => {
  const idnota = req.params.id; // ID do aluno (idnota)
  try {
    console.log("Entrei na rotina de exclusão - passo 1 ");
    const temDependencia = await verificarDependencias('alunos', 'idnota', 'aluno_id', idnota);
    console.log("Sai da rotina de exclusão - passo 3 ");
    if (temDependencia) {
      // Dependência encontrada
      const [alunos] = await pool.query('SELECT * FROM alunos');
      return res.render('alunos', {
        alunos,
        errorMessage: 'Não é possível excluir o aluno. Ele está relacionado a registros na tabela de notas.',
        successMessage: null,
      });
    }

    // Excluir o aluno
    await pool.query('DELETE FROM alunos WHERE idaluno = ?', [idnota]);
    const [alunos] = await pool.query('SELECT * FROM alunos');
    res.render('alunos', {
      alunos,
      errorMessage: null,
      successMessage: 'Aluno excluído com sucesso!',
    });
  } catch (err) {
    console.error(err);
    res.redirect('/alunos');
//    const [alunos] = await pool.query('SELECT * FROM alunos');
//    res.render('alunos', {
//     alunos,
//      errorMessage: 'Erro ao excluir aluno.',
//      successMessage: null,
  };

});

// Rota para excluir professor
router.post('/professores/excluir/:id', async (req, res) => {
  const idprofessor = req.params.id; // ID do professor
  try {
    const temDependencia = await verificarDependencias('professores', 'idprofessor', 'professor_id', idprofessor);
    if (temDependencia) {
      const [professores] = await db.query('SELECT * FROM professores');
      return res.render('professores', {
        professores,
        errorMessage: 'Não é possível excluir o professor. Ele está relacionado a registros na tabela de notas.',
        successMessage: null,
      });
    }

    await db.query('DELETE FROM professores WHERE idprofessor = ?', [idprofessor]);
    const [professores] = await db.query('SELECT * FROM professores');
    res.render('professores', {
      professores,
      errorMessage: null,
      successMessage: 'Professor excluído com sucesso!',
    });
  } catch (err) {
    console.error(err);
    res.redirect('/professores');
  }
});

// Rota para excluir disciplina
router.post('/disciplinas/excluir/:id', async (req, res) => {
  const iddisciplina = req.params.id; // ID da disciplina
  try {
    const temDependencia = await verificarDependencias('disciplinas', 'iddisciplina', 'disciplina_id', iddisciplina);
    if (temDependencia) {
      const [disciplinas] = await db.query('SELECT * FROM disciplinas');
      return res.render('disciplinas', {
        disciplinas,
        errorMessage: 'Não é possível excluir a disciplina. Ela está relacionada a registros na tabela de notas.',
        successMessage: null,
      });
    }

    await db.query('DELETE FROM disciplinas WHERE iddisciplina = ?', [iddisciplina]);
    const [disciplinas] = await db.query('SELECT * FROM disciplinas');
    res.render('disciplinas', {
      disciplinas,
      errorMessage: null,
      successMessage: 'Disciplina excluída com sucesso!',
    });
  } catch (err) {
    console.error(err);
    res.redirect('/disciplinas');
  }
});

module.exports = router;
