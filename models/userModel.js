const db = require('./models/db');
require('dotenv').config();

// Busca um usuário pelo nome de usuário
exports.getUserByUsername = async (username) => {
    const query = 'SELECT * FROM users WHERE username = $1';
    const [rows] = await db.execute(query, [username]);
    return rows[0];
};

class User {
    // Busca um usuário pelo e-mail
    static async findOneByEmail(email) {
        const [rows] = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        return rows[0] || null;
    }

    // Atualiza o token de redefinição de senha
    static async updateResetToken(email, token, expiration) {
        await pool.query(
            'UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE email = $3',
            [token, expiration, email]
        );
    }
}

module.exports = User;