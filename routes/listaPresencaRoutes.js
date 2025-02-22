const express = require("express");
const router = express.Router();
const listaPresencaController = require("../controllers/listaPresencaController");


router.get("/", listaPresencaController.exibirFiltro);

// Rota para gerar a lista e exibir o relatório
router.post("/gerar", listaPresencaController.gerarLista);

// Rota para visualizar o relatório (opcional)
router.post("/visualizar", listaPresencaController.visualizarRelatorio);

// Rota para exportar o PDF
router.post("/pdf", listaPresencaController.exportarPDF);


module.exports = router;
