const express = require('express');

const mysql = require('mysql2/promise'); // Biblioteca para trabalhar com MySQL usando async/await
const app = express();

app.set('view engine', 'ejs');  // Define EJS como motor de visualização
app.set('views', './views');    // Define o diretório de views


// Configuração da conexão com o banco de dados
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'casadamusica'
});

module.exports = db;
