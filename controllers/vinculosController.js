const pool = require('../models/db'); // Certifique-se de configurar a conexão com o MySQL
const { format } = require('date-fns');
const { getProfessorName, getDisciplinaName } = require('../utils/formartarDados');


// Página inicial - listar vinculos
exports.listarVinculos =  async (req, res) => {
    try {
      const [notas] = await pool.query('SELECT * FROM vinculos');
      res.render('vinculos', { vinculos });
    } catch (err) {
      console.error(err);
      res.status(500).send('Erro ao listar vinculos');

    }
};
  
// Inserir notas
exports.inserirVinculo = async (req, res) => {
  const { iddisciplina, idprofessor, data_vinculo, obs } = req.body;

  try {
      await pool.query(`INSERT INTO vinculos (iddisciplina, idprofessor, data_vinculo, obs) VALUES (?, ?, ?, ?)`, [iddisciplina, idprofessor, data_vinculo, obs]

      );
      res.redirect('/vinculos');

    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          const errorMessage = 'Erro: Essa combinação de disciplina e professor já existe!';
          const [vinculos] = await pool.query('SELECT * FROM vinculos');
          res.render('vinculos', { vinculos, errorMessage });
        } else {
            console.error('Erro ao inserir vínculo:', err);
            res.status(500).json({ message: 'Erro no servidor' });
        }
    }
};

// Atualizar vinculoss
exports.atualizarVinculo =  async (req, res) => {
  const { idvinculo } = req.params; 
  const{ data_vinculo, obs } = req.body;
  try {

    await pool.query(`UPDATE vinculos SET data_vinculo = ?, obs = ? WHERE idvinculo = ?`, [data_vinculo, obs, idvinculo]);
    res.redirect('/vinculos');

  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao atualizar vinculo');

  }
};
  
  // Excluir nptas
  exports.excluirVinculo = async (req, res) => {

    const { idvinculo } = req.params; // Obtém o ID da URL
    try {
      await pool.query(`DELETE FROM vinculos WHERE idvinculo = ?`, [idvinculo]);
      res.redirect('/vinculos');
      
    } catch (err) {
      console.error(err);
      res.status(500).send('Erro ao excluir vinculo');
  
    }
  };

/* ------------------------------------

// Função para renderizar a página de vinculos com os dados formatados.
exports.renderVinculosPage = async (req, res) => {

  try {
      const [vinculos] = await pool.query('SELECT * FROM vinculos'); 

      for (let vinculo of vinculos) {

        vinculo.disciplina_nome = `${vinculo.iddisciplina}- ${await getDisciplinaName(vinculo.iddisciplina)}`;
        vinculo.professor_nome = `${vinculo.idprofessor}- ${await getProfessorName(vinculo.idprofessor)}`;
        vinculo.data_vinculo_formatada = format(new Date(vinculo.data_vinculo), 'dd/MM/yyyy'); // Formata a data.

      }
      res.render('vinculos', { vinculos }); 
  } catch (error) {
      console.error('Erro ao renderizar a página de vinculos:', error);
      res.status(500).send('Erro ao carregar a página de vinculos');
  }
};




// Função para renderizar a página de vínculos com os dados formatados.
exports.renderVinculosPage = async (req, res) => {
  try {
    const [vinculos] = await pool.query('SELECT * FROM vinculos'); 

    for (let vinculo of vinculos) {
      try {
        // Tenta buscar e formatar os dados do vínculo
        vinculo.disciplina_nome = `${vinculo.iddisciplina} - ${await getDisciplinaName(vinculo.iddisciplina)}`;
        vinculo.professor_nome = `${vinculo.idprofessor} - ${await getProfessorName(vinculo.idprofessor)}`;
        vinculo.data_vinculo_formatada = format(new Date(vinculo.data_vinculo), 'dd/MM/yyyy'); // Formata a data.
      } catch (innerError) {
        console.error(`Erro ao processar o vínculo com ID ${vinculo.idvinculo}:`, innerError);
        // Define valores padrão ou exibe uma mensagem de erro para evitar quebra
        vinculo.disciplina_nome = 'Erro ao obter disciplina';
        vinculo.professor_nome = 'Erro ao obter professor';
        vinculo.data_vinculo_formatada = 'Data inválida';
      }
    }

    res.render('vinculos', { vinculos }); 
  } catch (error) {
    console.error('Erro ao renderizar a página de vínculos:', error);
    res.status(500).send('Erro ao carregar a página de vínculos');
  }
};

--------------------------*/

// Função para renderizar a página de vínculos com os dados formatados.
exports.renderVinculosPage = async (req, res) => {
  try {
    const [vinculos] = await pool.query('SELECT * FROM vinculos');

    // Use Promise.all para garantir que todas as operações assíncronas sejam concluídas
    const vinculosFormatados = await Promise.all(
      vinculos.map(async (vinculo) => {
        try {
          // Busque e formate os dados do vínculo
          vinculo.disciplina_nome = `${vinculo.iddisciplina} - ${await getDisciplinaName(vinculo.iddisciplina)}`;
          vinculo.professor_nome = `${vinculo.idprofessor} - ${await getProfessorName(vinculo.idprofessor)}`;
          vinculo.data_vinculo_formatada = format(new Date(vinculo.data_vinculo), 'dd/MM/yyyy'); // Formata a data
        } catch (innerError) {
          console.error(`Erro ao processar vínculo com ID ${vinculo.idvinculo}:`, innerError);
          // Valores padrão em caso de erro
          vinculo.disciplina_nome = 'Erro ao obter disciplina';
          vinculo.professor_nome = 'Erro ao obter professor';
          vinculo.data_vinculo_formatada = 'Data inválida';
        }
        return vinculo;
      })
    );

    // Renderize a página com os dados formatados
    res.render('vinculos', { vinculos: vinculosFormatados });
  } catch (error) {
    console.error('Erro ao renderizar a página de vínculos:', error);
    res.status(500).send('Erro ao carregar a página de vínculos');
  }
};


