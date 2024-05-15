const express = require('express');//Importa o módulo express, que é um framework web para Node.js, 
                                   //permitindo criar aplicativos web e APIs de forma fácil e rápida.
                                      

const bodyParser = require('body-parser');// Importa o módulo body-parser, que é um middlewareque analisa o corpo das solicitações HTTP, 
                                          //disponibilizando os dados em req.body.

const mysql = require('mysql');// Importa o módulo mysql, que fornece uma API para interagir com bancos de dados MySQL a partir do Node.js.

const app = express(); //Cria uma instância do aplicativo Express.

const port = 3000; //Define a porta na qual o servidor irá ouvir por solicitações HTTP.

// Configuração do body-parser para ler dados do corpo das solicitações
app.use(bodyParser.urlencoded({ extended: false })); //Configura o middleware body-parser para analisar dados de formulário URL-encoded.
app.use(bodyParser.json()); // Configura o middleware body-parser para analisar dados de formulário URL-encoded.

// Configuração do banco de dados MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'banco'
}); //Cria uma conexão com o banco de dados MySQL utilizando as credenciais especificadas 

// Conexão com o banco de dados
connection.connect(err => {
  if (err) {
    console.error('Erro na conexão com o banco de dados: ' + err.stack);
    return;
  }
  console.log('Conexão com o banco de dados estabelecida');
}); //Estabelece a conexão com o banco de dados e lida com possíveis erros durante a conexão.

// Definição de rota para lidar com a criação de um registro
app.post('/cadastro', (req, res) => {
  const { nome, morada, telefone, email, pin } = req.body;
  const sql = `insert into cadastro (nome, morada, telefone, email, pin) VALUES (?, ?, ?, ?, ?)`;
  connection.query(sql, [nome, morada, telefone, email, pin], (err, result) => {
    if (err) {
      console.error('Erro ao criar registro: ' + err.stack);
      res.status(500).send('Erro ao criar registro');
      return;
    }
    console.log('Registro criado com sucesso');
    res.send('Registro criado com sucesso');
  });
});

// Definição de rota para ler todos os registros
app.get('/cadastro', (req, res) => {
  const sql = `select * from cadastro`;
  connection.query(sql, (err, result) => {
    if (err) {
      console.error('Erro ao ler registros: ' + err.stack);
      res.status(500).send('Erro ao ler registros');
      return;
    }
    console.log('Registros lidos com sucesso');
    res.json(result);
  });
});

app.post('/cadastro/:id', (req, res) => {
    const { id } = req.params;
    const { nome, morada, telefone, email, pin } = req.body;
    const sql = `UPDATE cadastro SET nome=?, morada=?, telefone=?, email=?, pin=? WHERE id=?`;
    connection.query(sql, [nome, morada, telefone, email, pin, id], (err, result) => {
        if (err) {
            console.error('Erro ao atualizar registro: ' + err.stack);
            res.status(500).send('Erro ao atualizar registro');
            return;
        }
        console.log('Registro atualizado com sucesso');
        res.send('Registro atualizado com sucesso');
    });
});

app.get('/cadastro/:id', (req, res) => {
    const { id } = req.params;
    const sql = `SELECT * FROM cadastro WHERE id=?`;
    connection.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Erro ao buscar registro: ' + err.stack);
            res.status(500).send('Erro ao buscar registro');
            return;
        }
        if (result.length === 0) {
            res.status(404).send('Registro não encontrado');
            return;
        }
        const registro = result[0];
        res.json(registro);
    });
});

app.delete('/cadastro/:id', (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM cadastro WHERE id = ?`;
    connection.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Erro ao excluir registro: ' + err.stack);
            res.status(500).send('Erro ao excluir registro');
            return;
        }
        console.log('Registro excluído com sucesso');
        res.send('Registro excluído com sucesso');
    });
});




app.listen(port, () => {
  console.log(`Servidor está ouvindo na porta ${port}`);
}); // Inicia o servidor Express para ouvir por solicitações HTTP na porta especificada,
// exibindo uma mensagem no console quando o servidor é iniciado com sucesso.