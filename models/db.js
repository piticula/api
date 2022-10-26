/**
 * Faz a conexão com o banco de dados
 */
'use strict';

const mysql = require('mysql2');

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'cursostpf'
});

const connection2 = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: ''
});

// Cria conexão para criar um banco de dados.
connection2.connect((err) => {
    if (err) return console.log('Erro ao conectar com o Mysql. ' + err);
    console.log('o Mysql está conectado !');
    cria_Banco(connection2);
});


//Cria o banco de dados.
function cria_Banco(conn2) {
    const sql = 'CREATE DATABASE IF NOT EXISTS cursostpf';
    conn2.query(sql, (error, results, fields) => {
        if (error) return console.log('Erro ao criar o Banco de Dados cursostpf. ' + error);
        console.log('Banco de Dados cursostpf está Ativo !');
        var connection = mysql.createConnection({
            host: 'localhost',
            port: 3306,
            user: 'root',
            password: '',
            database: 'cursostpf'
        });
        cria_Tab_usuarios(connection);
        cria_Tab_cursos(connection);
        cria_Tab_matriculas(connection);
    });
    conn2.end;
}

const conexao = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'cursostpf'
});

//Tabela de Usuários
function cria_Tab_usuarios(conn) {
    var sql = '';
    sql = "SELECT table_name FROM information_schema.tables WHERE table_schema = 'cursostpf' " +
        "AND table_name = 'Usuarios'";
    conn.query(sql, (error, affectedRows, fields) => {

        if (affectedRows == 0) {
            sql = 'CREATE TABLE if not exists Usuarios ( ' +
                'id INT NOT NULL AUTO_INCREMENT, ' +
                'Nome VARCHAR(100) NOT NULL, ' +
                'PRIMARY KEY (id) )';
            conn.query(sql, (error, results, fields) => {
                if (error) return console.log('Erro ao criar a Tabela de Usuários. ' + error);
                console.log('criou a Tabela de Usuários!');
                add_usuarios(conn);
            });
        }
    });
}
// Tabela de Cursos.
function cria_Tab_cursos(conn) {
    var sql = '';
    sql = "SELECT table_name FROM information_schema.tables WHERE table_schema = 'cursostpf' " +
        "AND table_name = 'Cursos'";
    conn.query(sql, (error, affectedRows, fields) => {
        if (affectedRows == 0) {
            sql = 'CREATE TABLE if not exists Cursos ( ' +
                'id INT NOT NULL AUTO_INCREMENT, ' +
                'Curso VARCHAR(100) NOT NULL, ' +
                'PRIMARY KEY (id) )';
            conn.query(sql, (error, results, fields) => {
                if (error) return console.log('Erro ao criar a Tabela de Cursos. ' + error);
                console.log('criou a Tabela de Cursos!');
                add_cursos(conn);
            });
        }
    });
}

// Tabela Matricula dos Cursos dos Usuários.
function cria_Tab_matriculas(conn) {
    var sql = '';
    sql = "SELECT table_name FROM information_schema.tables WHERE table_schema = 'cursostpf' " +
        "AND table_name = 'Matriculas'";
    conn.query(sql, (error, affectedRows, fields) => {
        if (affectedRows == 0) {
            sql = 'CREATE TABLE IF NOT EXISTS Matriculas ( ' +
                'id int NOT NULL AUTO_INCREMENT, ' +
                'ID_Usuario integer NOT NULL, ' +
                'ID_Curso integer NOT NULL, ' +
                'data date, ' +
                'datinicio date, ' +
                'datfim date, ' +
                'status integer NOT NULL, ' +
                'PRIMARY KEY(id) ) '
                // 'CONSTRAINT fk_Usuario FOREIGN KEY (ID_Usuario) REFERENCES Usuarios(id), ' +
                // 'CONSTRAINT fk_Curso FOREIGN KEY (ID_Curso) REFERENCES Cursos(id) )'
            conn.query(sql, (error, results, fields) => {
                if (error) return console.log('Erro ao criar a Tabela de Matrículas. ' + error);
                console.log('criou a Tabela de Matrículas!');
                add_matriculas(conn);
            });
        }
    });
}

function execSQLQuery(sqlQry, req, res) {
    req.getConnection(function (err, connection) {
        connection.query(sqlQry, (error, results, fields) => {
            if ((error != null) && (results == '')) {
                res.status(404);
                res.json({"message":"Não existem registros!"});
            }
            if (error) {
                res.status(500);
                res.json({ "message": "Erro Interno do Servidor. Erro.: " + error });
            }
            else {
                if ((sqlQry.includes('select')) || (sqlQry.includes('SELECT')) ||
                    (sqlQry.includes('delete')) || (sqlQry.includes('DELETE')) ||
                    (sqlQry.includes('update')) || (sqlQry.includes('UPDATE'))) {
                    if (sqlQry.includes('select') || sqlQry.includes('SELECT')) {
                        res.json(results);
                    } 
                    else if (sqlQry.includes('delete') || sqlQry.includes('DELETE')) {
                        res.json({ "message": "Usuário excluído com sucesso!" });
                    } 
                    else if (sqlQry.includes('update') || sqlQry.includes('UPDATE')) {
                        res.json({ "message": "Usuário atualizado com sucesso!" });
                    }  
                }
            }
            connection.release();
      
        });
    });
}

function add_usuarios(conn) {
    const sql = "INSERT INTO Usuarios(Nome) VALUES ?";
    const values = [
        ['Edmar Rodrigues de Almeida'],
        ['Joao Augusto da Silva'],
        ['Mário de Andrade de Souza'],
        ['Casio Cesar Augusto de Oliveira'],
        ['Sebastião Muniz Nunes'],
        ['Maria Rosa dos Santos'],
        ['José Luis Carvalho'],
        ['Carlos Alberto de Nobrega'],
        ['Renato Aragão'],
        ['Marco Antonio Diniz'],
        ['Renato Junqueira Franco'],
        ['Manoel Roberto da Nobrega'],
        ['Maria Clara Novaes'],
        ['Agata Cristina Roldão']
    ];
    conn.query(sql, [values], (error, results, fields) => {
        conn.release;
        if (error) return console.log(error);
        console.log('Adicionou 14 usuários.');
    });
}

function add_cursos(conn) {
    const sql = "INSERT INTO Cursos(Curso) VALUES ?";
    const values = [
        ['Transporte de produtos perigosos'],
        ['Cargas indivisíveis e outras regulamentadas pelo Contran'],
        ['Transporte coletivo de passageiros'],
        ['Transporte de escolares']
    ];
    conn.query(sql, [values], (error, results, fields) => {
        conn.release;
        if (error) return console.log('Erro ao adicionar os cursos. ' + error);
        console.log('Adicionou 4 cursos.');
    });
}

function add_matriculas(conn) {
    const sql = "INSERT INTO Matriculas(ID_USUARIO, ID_CURSO, DATA, DATINICIO, DATFIM, STATUS) VALUES ?";
    const values = [
        [1, 1, '2022-10-17', '2022-10-20','2022-10-30', 1],  // 1 - Cursando. 2 - Cancelada. 3 - Concluído.
        [1, 2, '2022-10-10', '2022-10-20','2022-10-30', 2],
        [1, 3, '2022-09-10', '2022-09-20','2022-09-30', 3],
        [2, 1, '2022-10-02', '2022-10-05','2022-10-15', 1],
        [2, 2, '2022-08-17', '2022-08-20','2022-08-30', 3],
        [3, 1, '2022-10-10', '2022-10-15','2022-10-25', 1]
    ];
    conn.query(sql, [values], (error, results, fields) => {
        conn.release;
        if (error) return console.log('Erro ao adicionar as matriculas. ' + error);
        console.log('Adicionou 6 matriculas.');
    });
}

module.exports = {
    conexao,
    execSQLQuery
};
