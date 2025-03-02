const axios = require('axios');

exports.buscaCep = async (req, res) => {
    try {
        const { cep } = req.params;
        const url = `https://viacep.com.br/ws/${cep}/json/`;
        const response = await axios.get(url);

        if (response.data.erro) {
            return res.status(404).json({ erro: 'CEP não encontrado' });
        }

        res.json(response.data);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao buscar CEP' });
    }
};
