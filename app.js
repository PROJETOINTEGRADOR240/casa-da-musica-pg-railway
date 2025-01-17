const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const authRoutes = require('./routes/authRoutes');
//const menuCadastroRoutes = require('./routes/menuCadastroRoutes');
const notasRoutes = require('./routes/notasRoutes');
const faltasRoutes = require('./routes/faltasRoutes');
const disciplinasRoutes = require('./routes/disciplinasRoutes');
const professoresRoutes = require('./routes/professoresRoutes');
const alunosRoutes = require('./routes/alunosRoutes');
const matriculasRoutes = require('./routes/matriculasRoutes');
const usuariosRoutes = require('./routes/usuariosRoutes');
const validateRoutes = require('./routes/validate');
const methodOverride = require('method-override');
const menuRoutes = require('./routes/menuRoutes');
const bodyParser = require('body-parser');
const path = require('path');
const ageReportRoutes = require('./routes/ageReportRoutes'); // Rota para relatórios por alunos - (Idade)
const ageChartRoutes = require('./routes/ageChartRoutes'); // Relatorio gráfico de barras por alunos - (Idade)
const agePieRoutes = require('./routes/agePieRoutes'); // Relatorio gráfico de pizza por alunos (Idade)
const genderReportRoutes = require('./routes/genderReportRoutes'); // Rota para relatórios - por (genero)
const genderChartRoutes = require('./routes/genderChartRoutes'); // Rota para gráfico - por (genero)
const relatorioRoutes = require('./routes/relatorioRoutes');
const relatorioProRoutes = require('./routes/relatorioProRoutes');
const relatorioDisRoutes = require('./routes/relatorioDisRoutes');
const relatorioTaxRoutes = require('./routes/relatorioTaxRoutes');
const relatorioMatRoutes = require('./routes/relatorioMatRoutes');
const demandasRoutes = require('./routes/demandasRoutes');

const app = express();
//const permissaoParaExcluirRoutes = require('./routes/permissaoParaExcluir');

// Permitindo o uso de JSON
app.use(express.json());

// Configura o method-override
app.use(methodOverride('_method'));



app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
}));

// Middleware para simular o nível do usuário
//app.use((req, res, next) => {
 //   req.session.userLevel = req.session.userLevel || 1; // Simula o nível 1 por padrão
  //  next();
//});

app.use(flash());

// Rotas da Aplicação para os Cadastros
app.use('/', authRoutes);
//app.use('/menuCadastro', menuCadastroRoutes)
app.use('/notas', notasRoutes);
app.use('/faltas', faltasRoutes);
app.use('/disciplinas', disciplinasRoutes);
app.use('/professores', professoresRoutes);
app.use('/alunos', alunosRoutes);
app.use('/matriculas', matriculasRoutes);


//app.use('/alunos/excluir/:id', permissaoParaExcluirRoutes);
app.use('/usuarios', usuariosRoutes);


// Rotas da Aplicação para os Relattórios
app.use('/reports', ageReportRoutes); // Rota para relatórios por idade 
app.use('/reports', genderReportRoutes); // Rota para relatórios por sexo
app.use('/reports', genderChartRoutes); // Rota para gráfico por sexo
app.use('/reports', ageChartRoutes); // Relatorio gráfico de barras - alunos
app.use('/reports', agePieRoutes); // Relatorio gráfico de pizza - alunos
app.use('/reports', demandasRoutes); // Relatorio gráfico de barras empilhado - disciplinas vs alunos


//app.use('/demandas', demandasRoutes);
//app.use('/reports', disciplinaReportRoutes); // Rota para relatórios por disciplina
//app.use('/reports', disciplinaChartRoutes); // Rota para gráfico por disciplina


app.use('/relatorio', relatorioRoutes); // Rota para relatórios gerencial alunos 
app.use('/relatorio', relatorioProRoutes); // Rota para relatórios gerencial professores 
app.use('/relatorio', relatorioDisRoutes); // Rota para relatórios gerencial  disciplinas
app.use('/relatorio', relatorioTaxRoutes); // Rota para relatórios gerencial  qtde de faltas dos alunos
app.use('/relatorio', relatorioMatRoutes); // Rota para relatórios gerencial  matricula em varias disciplinas



// Rotas do menu
app.use('/menu', menuRoutes);

// Rota para o menu de cadastros
app.get('/menuCadastro', (req, res) => {
  res.render('menuCadastro');
});

// Rota para o menu relatorios
app.get('/relatorioMenu', (req, res) => {
  res.render('relatorioMenu');
});

// Rota para o menu relatorios
app.get('/ageReport', (req, res) => {
  res.render('ageReport');
});


// Configurando as rotas e faltas na validação dos inputs na tela
app.use('/validate', validateRoutes);

// Rota inicial
//app.get('/', (req, res) => {
//    res.render('menu'); // Renderiza o menu.ejs (nome antigo)
//});


// Inicialização do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

