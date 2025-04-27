const { Client } = require('pg');
const fs = require('fs');

// Pegando as variáveis do Railway (ou configure direto aqui)
const client = new Client({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
  ssl: { rejectUnauthorized: false }, // Railway precisa disso!
});

async function runSQL() {
  try {
    await client.connect();
    console.log('Conectado no Railway!');

    const sql = fs.readFileSync('ScriptGerarPostgresDB.sql', 'utf8'); // <-- ajuste o caminho
    await client.query(sql);
    
    console.log('Script executado com sucesso!');
  } catch (err) {
    console.error('Erro ao executar script:', err);
  } finally {
    await client.end();
    console.log('Conexão encerrada.');
  }
}

runSQL();
