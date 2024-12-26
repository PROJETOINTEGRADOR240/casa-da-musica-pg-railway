const db = require('../models/db');

module.exports = function authorize(requiredLevels) {
    return async (req, res, next) => {
        console.log('Middleware authorize foi chamado.');
        try {
            const { email } = req.session; // Email do usuário autenticado
            if (!email) {
                console.log('Usuário não logado.');
                return res.status(401).render('error', {
                    message: 'Você precisa estar logado para acessar essa funcionalidade.',
                });
            }

            // Busca o nível do usuário no banco de dados
            const query = 'SELECT nivel FROM usuarios WHERE email = ?';
            console.log(`Executando consulta SQL com email: ${email}`);
            const [rows] = await db.query(query, [email]);

            if (rows.length === 0) {
                console.log('Usuário não encontrado.');
                return res.status(403).render('error', {
                    message: 'Usuário não encontrado no sistema.',
                });
            }

            const userLevel = rows[0].nivel;
            console.log(`Nível do usuário encontrado: ${userLevel}`);
            // Verifica se o nível do usuário está entre os níveis permitidos
            if (!requiredLevels.includes(userLevel)) {
                console.log('Nível não autorizado.');
                return res.status(403).render('error', {
                    message: 'Você não tem permissão para acessar esta funcionalidade.',
                });
            }
            console.log('Usuário autorizado.');
            next(); // Permitir acesso
        } catch (error) {
            console.error('Erro no middleware de autorização:', error);
            return res.status(500).render('error', {
                message: 'Erro interno no servidor. Tente novamente mais tarde.',
            });
        }
    };
};
