const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

// Servir arquivos estáticos da pasta "public"
app.use(express.static(path.join(__dirname, 'public')));

const API_TOKEN = '5eac7eed33be5311a952b795db3330ff43d380b2c6cd258dd4a6f4cdfcb3'; // Substitua pelo seu token de API

// Middleware para validar dados de entrada
const validateInput = (req, res, next) => {
    const { usuario, senha, regiao, tipoProxy } = req.body;

    // Validar se todos os campos obrigatórios foram fornecidos
    if (!usuario || !senha || !regiao || !tipoProxy) {
        return res.status(400).json({ error: 'Por favor, forneça todos os campos: usuario, senha, regiao, tipoProxy.' });
    }

    next();
};

// Rota para gerar proxy
app.post('/generate-proxy', validateInput, async (req, res) => {
    const { usuario, senha, regiao, tipoProxy } = req.body;

    try {
        const response = await axios.post('https://apid.iproyal.com/v1/residential/proxies/generate', {
            usuario,
            senha,
            regiao,
            tipo: tipoProxy
        }, {
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('Erro ao gerar proxy:', error.response ? error.response.data : error.message);
        res.status(error.response ? error.response.status : 500).json({ error: 'Erro interno ao gerar proxy.' });
    }
});

// Rota padrão para servir o index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}/`);
});
