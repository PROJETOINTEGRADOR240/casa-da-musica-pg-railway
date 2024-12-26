const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const authRoutes = require('./routes/authRoutes');
const notasRoutes = require('./routes/notasRoutes');
const faltasRoutes = require('./routes/faltasRoutes');
const disciplinasRoutes = require('./routes/disciplinasRoutes');
const professoresRoutes = require('./routes/professoresRoutes');
const alunosRoutes = require('./routes/alunosRoutes');
const usuariosRoutes = require('./routes/usuariosRoutes');
const validateRoutes = require('./routes/validate');
const methodOverride = require('method-override');
const menuRoutes = require('./routes/menuRoutes');
const bodyParser = require('body-parser');
const path = require('path');
const reportRoutes = require('./routes/reportRoutes'); // Rota para relatórios

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

// Rotas da aplicação
app.use('/', authRoutes);
app.use('/notas', notasRoutes);
app.use('/faltas', faltasRoutes);
app.use('/disciplinas', disciplinasRoutes);
app.use('/professores', professoresRoutes);
app.use('/alunos', alunosRoutes);
//app.use('/alunos/excluir/:id', permissaoParaExcluirRoutes);
app.use('/usuarios', usuariosRoutes);


// Rotas
app.use('/reports', reportRoutes); // Rota para relatórios



// Rotas do menu
app.use('/menu', menuRoutes);


// Configurando as rotas e faltas na validação dos inputs na tela
app.use('/validate', validateRoutes);

// Rota inicial
//app.get('/', (req, res) => {
//    res.render('menu'); // Renderiza o menu.ejs (nome antigo)
//});


// Inicialização do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

