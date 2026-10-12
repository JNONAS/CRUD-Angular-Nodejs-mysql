const express = require('express');

const connection = require('./config/database');

const app = express();

const cors = require('cors');

app.use(cors());

app.use(express.json());





app.get('/', (req, res) => {
    res.send('olá, mundo!');
});

app.get('/produtos', (req, res) => {
    connection.query('SELECT * FROM produtos', (erro, resultados) => {
        if (erro) {
            console.error('Erro ao buscar produtos:', erro);
            return res.status(500).json({ error: 'Erro ao buscar produtos' });
        }
        else {
            res.json(resultados);
        }
    });
});

app.post('/produtos', (req, res) => {
    const { nome, preco, estoque } = req.body;

    const sql = 'INSERT INTO produtos (nome, preco, estoque) VALUES (?, ?, ?)';

    connection.query(sql, [nome, preco, estoque], (erro, resultado) => {
        if (erro) {
            console.error(erro);
            return res.status(500).json({ mensagem: 'Erro ao criar produto' });
        }
        else {
            res.status(201).json({ id: resultado.insertId, nome, preco, estoque });
        }
    });
});


app.get('/produtos/:id', (req, res) => {
    const id = Number(req.params.id);

    const sql = 'SELECT * FROM produtos WHERE id = ?';

    connection.query(sql, [id], (erro, resultados) => {
        if (erro) {
            console.error(erro);
            return res.status(500).json({
                mensagem: 'Erro ao buscar produto'
            });
        }

        if (resultados.length === 0) {
            return res.status(404).json({
                mensagem: 'Produto não encontrado'
            });
        }

        res.json(resultados[0]);
    });
});

app.put('/produtos/:id', (req, res) => {
    const id = Number(req.params.id);
    const { nome, preco, estoque } = req.body;

    const sql = 'UPDATE produtos SET nome = ?, preco = ?, estoque = ? WHERE id = ?';

    connection.query(sql, [nome, preco, estoque, id], (erro, resultado) => {
        if (erro) {
            console.error(erro);
            return res.status(500).json({ mensagem: 'Erro ao atualizar produto' });
        }

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensagem: 'Produto não encontrado' });
        }

        res.json({ id, nome, preco, estoque });
    });
});

app.delete('/produtos/:id', (req, res) => {
    const id = Number(req.params.id);

    const sql = 'DELETE FROM produtos WHERE id = ?';

    connection.query(sql, [id], (erro, resultado) => {
        if (erro) {
            console.error(erro);
            return res.status(500).json({ mensagem: 'Erro ao excluir produto' });
        }

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensagem: 'Produto não encontrado' });
        }

        res.json({ mensagem: 'Produto excluído com sucesso' });
    });
});

app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});