const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'crud_db'
});

connection.connect((erro) => {
    if (erro) {
        console.error('Erro ao conectar com o banco:', erro);
        return;
    }

    else {
        console.log('MySQL conectado com sucesso!');
    }
});

module.exports = connection;