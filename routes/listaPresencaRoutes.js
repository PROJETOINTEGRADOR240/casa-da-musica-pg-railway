const express = require("express");
const router = express.Router();
const listaPresencaController = require("../controllers/listaPresencaController");


router.get("/", listaPresencaController.exibirFiltro);

// Rota para gerar a lista e exibir
router.post("/gerar", listaPresencaController.gerarLista);

// Rota para visualizar a lista (opcional)
// router.post("/visualizar", listaPresencaController.visualizarRelatorio);

// Rota para exportar em PDF
router.post("/pdf", listaPresencaController.exportarPDF);


module.exports = router;
