const pool = require('../models/db');

module.exports = {
    // Exibir a tela de cadastro com listas de salas e sensores
    async exibirCadastro(req, res) {
        try {
            const [salas] = await pool.query('SELECT * FROM salas');
            const [sensores] = await pool.query('SELECT * FROM sensores');
            res.render('salasSensores', { salas, sensores });
        } catch (error) {
            console.error('Erro ao carregar cadastro:', error);
            res.status(500).send('Erro ao carregar a página');
        }
    },

    // CRUD para Salas
    async criarSala(req, res) {
        const { nome } = req.body;
        try {
            await pool.query('INSERT INTO salas (nome) VALUES (?)', [nome]);
            res.redirect('/salasSensores');
        } catch (error) {
            console.error('Erro ao criar sala:', error);
            res.status(500).send('Erro ao cadastrar sala');
        }
    },
    async listarSalas(req, res) {
        try {
            const [salas] = await pool.query('SELECT * FROM salas');
            res.json(salas);
        } catch (error) {
            console.error('Erro ao listar salas:', error);
            res.status(500).json({ erro: 'Erro ao listar salas' });
        }
    },
    async atualizarSala(req, res) {
        const { id } = req.params;
        const { nome } = req.body;
        try {
            await pool.query('UPDATE salas SET nome = ? WHERE id = ?', [nome, id]);
            res.json({ sucesso: 'Sala atualizada' });
        } catch (error) {
            console.error('Erro ao atualizar sala:', error);
            res.status(500).json({ erro: 'Erro ao atualizar sala' });
        }
    },
    async excluirSala(req, res) {
        const { id } = req.params;
        try {
            await pool.query('DELETE FROM salas WHERE id = ?', [id]);
            res.json({ sucesso: 'Sala excluída' });
        } catch (error) {
            console.error('Erro ao excluir sala:', error);
            res.status(500).json({ erro: 'Erro ao excluir sala' });
        }
    },

    // CRUD para Sensores
    async criarSensor(req, res) {
        const { descricao } = req.body;
        try {
            await pool.query('INSERT INTO sensores (descricao) VALUES (?)', [descricao]);
            res.redirect('/salasSensores');
        } catch (error) {
            console.error('Erro ao criar sensor:', error);
            res.status(500).send('Erro ao cadastrar sensor');
        }
    },
    async listarSensores(req, res) {
        try {
            const [sensores] = await pool.query('SELECT * FROM sensores');
            res.json(sensores);
        } catch (error) {
            console.error('Erro ao listar sensores:', error);
            res.status(500).json({ erro: 'Erro ao listar sensores' });
        }
    },
    async atualizarSensor(req, res) {
        const { id } = req.params;
        const { descricao } = req.body;
        try {
            await pool.query('UPDATE sensores SET descricao = ? WHERE id = ?', [descricao, id]);
            res.json({ sucesso: 'Sensor atualizado' });
        } catch (error) {
            console.error('Erro ao atualizar sensor:', error);
            res.status(500).json({ erro: 'Erro ao atualizar sensor' });
        }
    },
    async excluirSensor(req, res) {
        const { id } = req.params;
        try {
            await pool.query('DELETE FROM sensores WHERE id = ?', [id]);
            res.json({ sucesso: 'Sensor excluído' });
        } catch (error) {
            console.error('Erro ao excluir sensor:', error);
            res.status(500).json({ erro: 'Erro ao excluir sensor' });
        }
    }
};