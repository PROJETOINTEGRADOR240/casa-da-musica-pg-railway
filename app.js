const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const path = require('path');
const pool = require('./models/db');

const cepRoutes = require('./routes/cepRoutes'); 
const authRoutes = require('./routes/authRoutes'); // Módulo autenticação
const notasRoutes = require('./routes/notasRoutes'); // Módulo notas
const faltasRoutes = require('./routes/faltasRoutes'); // Módulo faltas
const disciplinasRoutes = require('./routes/disciplinasRoutes'); // Módulo disciplinas
const professoresRoutes = require('./routes/professoresRoutes'); // Módulo professores 
const alunosRoutes = require('./routes/alunosRoutes'); // Módulo alunos
const matriculasRoutes = require('./routes/matriculasRoutes'); // Módulo matriculas 
const vinculosRoutes = require('./routes/vinculosRoutes'); // Módulo Disciplinas vs Professores
const usuariosRoutes = require('./routes/usuariosRoutes'); // Módulo do sistama
const validateRoutes = require('./routes/validate');
const menuRoutes = require('./routes/menuRoutes');
const ageReportRoutes = require('./routes/ageReportRoutes'); // Rota para relatórios por alunos - (Idade)
const ageChartRoutes = require('./routes/ageChartRoutes'); // Relatorio gráfico de barras por alunos - (Idade)
const agePieRoutes = require('./routes/agePieRoutes'); // Relatorio gráfico de Rosca por alunos (Idade)
const genderReportRoutes = require('./routes/genderReportRoutes'); // Rota para relatórios - por (genero)
const genderChartRoutes = require('./routes/genderChartRoutes'); // Rota para gráfico - por (genero)
const relatorioRoutes = require('./routes/relatorioRoutes');
const relatorioProRoutes = require('./routes/relatorioProRoutes');
const relatorioDisRoutes = require('./routes/relatorioDisRoutes');
const relatorioDisciplinaProfessorRoutes = require('./routes/relatorioDisciplinaProfessorRoutes');
const relatorioTaxRoutes = require('./routes/relatorioTaxRoutes');
const relatorioMatRoutes = require('./routes/relatorioMatRoutes');
const demandasRoutes = require('./routes/demandasRoutes');
const listaPresencaRoutes = require("./routes/listaPresencaRoutes");

// Importando rotas - Rotina IoT
const salasRoutes = require('./routes/salasRoutes');
const sensoresRoutes = require('./routes/sensoresRoutes');
const monitoramentoRoutes = require('./routes/monitoramentoRoutes');

const app = express();

// Permitindo o uso de JSON
app.use(express.json());

// Configura o method-override
app.use(methodOverride('_method'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// Middleware para definir vlibras antes das rotas
app.use((req, res, next) => {
  res.locals.vlibras = `
      <!-- VLibras Widget -->
      <div vw class="enabled">
          <div vw-access-button class="active"></div>
          <div vw-plugin-wrapper>
              <div class="vw-plugin-top-wrapper"></div>
          </div>
      </div>
      <script src="https://vlibras.gov.br/app/vlibras-plugin.js"></script>
      <script>
          new window.VLibras.Widget("https://vlibras.gov.br/app");
      </script>
  `;
  next();
});


app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: false,
}));


app.use(flash());

// Rotas da Aplicação para os Cadastros
app.use('/', authRoutes);
app.use('/notas', notasRoutes);
app.use('/faltas', faltasRoutes);
app.use('/disciplinas', disciplinasRoutes);
app.use('/professores', professoresRoutes);
app.use('/alunos', alunosRoutes);
app.use('/matriculas', matriculasRoutes);
app.use('/vinculos', vinculosRoutes);
app.use('/usuarios', usuariosRoutes);


// Rotas da Aplicação para os Relatórios - Módulo Estatístico
app.use('/reports', ageReportRoutes); // Relatórios por idade 
app.use('/reports', genderReportRoutes); // Relatórios por sexo
app.use('/reports', genderChartRoutes); // Gráfico por sexo
app.use('/reports', ageChartRoutes); // Gráfico de barras - alunos
app.use('/reports', agePieRoutes); // Gráfico de pizza - alunos
app.use('/reports', demandasRoutes); // Gráfico de barras empilhado - disciplinas vs alunos


app.use('/relatorio', relatorioRoutes); // Relatórios gerencial alunos 
app.use('/relatorio', relatorioProRoutes); // Relatórios gerencial professores 
app.use('/relatorio', relatorioDisRoutes); // Relatórios gerencial disciplinas
app.use('/relatorio', relatorioDisciplinaProfessorRoutes); // Relatórios gerencial disciplinas VS professor
app.use('/relatorio', relatorioTaxRoutes); // Relatórios gerencial  qtde de faltas dos alunos
app.use('/relatorio', relatorioMatRoutes); // Relatórios gerencial  matricula em varias disciplinas
app.use("/lista-presenca", listaPresencaRoutes); // Lista de preseça dos alunos

// Rotas para IoT
app.use(salasRoutes);
app.use(sensoresRoutes);
app.use(monitoramentoRoutes);

// Rotas do menu
app.use('/menu', menuRoutes);

// Rota para o menu de cadastros
app.get('/menuCadastro', (req, res) => {
  res.render('menuCadastro');
});

// Rota para o menu de cadastros Especificos
app.get('/menuEspecifico', (req, res) => {
  res.render('menuEspecifico');
});

// Rota para o menu relatorios
app.get('/relatorioMenu', (req, res) => {
  res.render('relatorioMenu');
});

// Rota para o menu relatorios
app.get('/ageReport', (req, res) => {
  res.render('ageReport');
});


// Rota para buscar o CEP
app.use('/busca-cep', cepRoutes);

// Rota para a página inicial (index)
app.get('/home', async (req, res) => {
  const [salas] = await pool.query('SELECT * FROM salas');  // Consulta a tabela salas
  const [sensores] = await pool.query('SELECT * FROM sensores');  // Consulta a tabela sensores
  const [dados] = await pool.query('SELECT * FROM monitoramento');  // Consulta a tabela monitoramento
  res.render('indexMonitoramento', { salas, sensores, dados });  // Passa a variável salas para o EJS
});

// Configurando as rotas e faltas na validação dos inputs na tela
app.use('/validate', validateRoutes);


// Inicialização do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

