const demandasModel = require('../models/demandasModel');

exports.renderFilterPage = (req, res) => {

  res.render('filtro-relatorio-demanda');
};

exports.generateChart = async (req, res) => {
  try {
      // Obtém todos os registros do modelo
      const rows = await demandasModel.getFilteredData ();

     
      res.render('demandaChart',  { rows });
    } catch (error) {

        console.error('Erro ao gerar relatório:', error.message);

        res.status(500).send('Erro interno no servidor');
    }
};

