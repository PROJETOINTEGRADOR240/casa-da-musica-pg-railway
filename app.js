const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const authRoutes = require('./routes/authRoutes');
const notasRoutes = require('./routes/notasRoutes');
const faltasRoutes = require('./routes/faltasRoutes');
const disciplinasRoutes = require('./routes/disciplinasRoutes');
const professoresRoutes = require('./routes/professoresRoutes');
const alunosRoutes = require('./routes/alunosRoutes');
const validateRoutes = require('./routes/validate');
const methodOverride = require('method-override');

const app = express();
const permissaoParaExcluirRoutes = require('./routes/permissaoParaExcluir');

// Permitindo o uso de JSON
app.use(express.json());

// Configura o method-override
app.use(methodOverride('_method'));


app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', './views');



app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
}));

app.use(flash());

// Rotas da aplicação
app.use('/', authRoutes);
app.use('/notas', notasRoutes);
app.use('/faltas', faltasRoutes);
app.use('/disciplinas', disciplinasRoutes);
app.use('/professores', professoresRoutes);
app.use('/alunos', alunosRoutes);
app.use('/', permissaoParaExcluirRoutes);

/* ------- Desenvolvimento futuro ----------------- 

app.use('/usuarios', usuariosRoutes);

 --------------------------------------------------*/


// Configurando as rotas e faltas na validação dos inputs na tela
app.use('/validate', validateRoutes);

// Rota inicial
app.get('/', (req, res) => {
    res.render('menu'); // Renderiza o menu.ejs (nome antigo)
});


// Inicialização do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

