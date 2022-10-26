/**
 * API de Cadastro de Cursos.
 * Avaliação TPF.
 * Autor: Edmar.
 */

const express = require('express'),
    mysql = require('mysql2'),
    cors = require('cors'),
    bodyParser = require('body-parser'),
    myconnection = require('express-myconnection');

const app = express();
const port = 9001;

const Banco = require('./models/db');

var config = require('./config');

var dbOptions = {
    host: config.database.host,
    user: config.database.user,
    password: config.database.password,
    database: config.database.db,
    port: config.database.port
}

app.use(myconnection(mysql, dbOptions, 'pool'));
console.log(dbOptions);

const urlencodeParser = bodyParser.urlencoded({ extended: false });
app.use(bodyParser.json());

app.use((req, res, next) => {
    //     Acesso ao Midleware e permissão de uso das ações
    //     de alteração de dados GET, PUT,POST e DELETE
    res.header("Access-Control-Allow-Origin", "*");
    //res.header("Access-Control-Allow-Headers, *");
    res.header("Access-Control-Allow-Headers", "Origin, X-Request-Width, Content-Type, Accept");
    //res.header("Access-Control-Allow-Methods: GET, PUT, POST, DELETE");
    res.header("Content-Type: application/json; Accept: application/json");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");

    next();
    //    app.use(cors());
});

app.get('/', (req, res) => res.json({ message: 'Funcionando!' }));

app.listen(port);
console.log('Servidor ativo. https://localhost:9001');


// Rotas da API---------------------------------------------- 
// Rotas de Usuarios.

app.get('/usuarios/:pag?/:qtdePag?', (req, res) => {
    let pagina =  req.params.pag;
    let qtdePagina =  req.params.qtdePag;
    let qtdeInicio = 0;
    if(qtdePagina =='T') { qtdePagina = 10 }
    
    qtdeInicio = ( (pagina * qtdePagina) - qtdePagina );
    
    let sql = 'SELECT * From Usuarios ORDER BY Nome LIMIT ' + parseInt(qtdeInicio) + ', ' + parseInt(qtdePagina);
    
    Banco.conexao.query(sql, (error, results, fields) => {
        if(error) {
            res.status(500);
            res.json({"message":"Erro Interno do Servidor. Erro.: " + error});
        } else if (results.length > 0) {
            res.status(200);
            res.json(results);
        } else {
            res.status(404);
            res.json({"message": "Nenhum Usuário encontrado!"});
        }
    });
});

app.post('/usuarios/:tip/:id?', (req, res) => {
    let filter = '';
    let sql = '';
    let tipo = req.params.tip;
    if (tipo == 'I') {
        const nome  = req.body.data.nome;
        sql = `INSERT INTO Usuarios(Nome) VALUES('${nome}')`;
         //Banco.execSQLQuery(`INSERT INTO Usuarios(Nome) VALUES('${nome}')`, req, res);
    }
    else
    {
        if(req.params.id && req.params.id !='C') filter = ' WHERE id =' + parseInt(req.params.id);
        sql = 'SELECT * FROM Usuarios ' + filter + ' Order by Nome';  
        //Banco.execSQLQuery('SELECT * FROM Usuarios ' + filter, req, res);      
    }  
   
    Banco.conexao.query(sql, (error, results, fields) => {
        if (error) {
            res.status(500);
            res.json({ "message": "Erro Interno do Servidor. Erro.: " + error });
        } else {
            if (tipo == 'I') {
                res.status(201);
                res.json({ "message": "Usuário "+ req.body.data.nome +" inserido com sucesso!" });
            }
            else
            {
                if (results.length > 0) {
                    res.status(200);
                    res.json(results);
                } else {
                    res.status(404);
                    res.json({"message": "Nenhum Usuário foi encontrado!"});
                } 
            }
        }
    });
});

app.put('/usuarios/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const nome  = req.body.data.nome;
    //Banco.execSQLQuery(`UPDATE Usuarios SET Nome='${nome}' WHERE id = ${id}`, req, res);
     sql = `UPDATE Usuarios SET Nome='${nome}' WHERE id = ${id}`;  
     Banco.conexao.query(sql, (error, results, fields) => {
         if (error) {
             res.status(500);
             res.json({ "message": "Erro Interno do Servidor. Erro.: " + error });
         } else {
             res.status(201);
             res.json({ "message": "Usuário "+ req.body.data.nome +" atualizado com sucesso!" });

         }
     });
});
  
app.delete('/usuarios/:id', (req, res) =>{
    Banco.execSQLQuery('DELETE FROM Usuarios WHERE id =' + parseInt(req.params.id), req, res);
});
// -------------------------------------------------------------
//Rotas de Cursos.
app.get('/cursos/:pag?/:qtdePag?', (req, res) => {
    let pagina =  req.params.pag;
    let qtdePagina =  req.params.qtdePag;
    let qtdeInicio = 0;
    if(qtdePagina =='T') { qtdePagina = 10 }
    
    qtdeInicio = ( (pagina * qtdePagina) - qtdePagina );
    
    let sql = 'SELECT * From Cursos ORDER BY Curso LIMIT ' + parseInt(qtdeInicio) + ', ' + parseInt(qtdePagina);
    
    Banco.conexao.query(sql, (error, results, fields) => {
        if(error) {
            res.status(500);
            res.json({"message":"Erro Interno do Servidor. Erro.: " + error});
        } else if (results.length > 0) {
            res.status(200);
            res.json(results);
        } else {
            res.status(404);
            res.json({"message": "Nenhum Curso foi encontrado!"});
        }
    });
});

app.post('/cursos/:tip/:id?', (req, res) => {
    let filter = '';
    let sql = '';
    let tipo = req.params.tip;
    if (tipo == 'I') {
        const curso  = req.body.data.curso;
        sql = `INSERT INTO Cursos(Curso) VALUES('${curso}')`;
    }
    else
    {
        if(req.params.id && req.params.id !='C') filter = ' WHERE id =' + parseInt(req.params.id);
        sql = 'SELECT * FROM Cursos ' + filter + ' Order by Curso';  
    }  
   
    Banco.conexao.query(sql, (error, results, fields) => {
        if (error) {
            res.status(500);
            res.json({ "message": "Erro Interno do Servidor. Erro.: " + error });
        } else {
            if (tipo == 'I') {
                res.status(201);
                res.json({ "message": "Curso "+ req.body.data.curso +" inserido com sucesso!" });
            }
            else
            {
                if (results.length > 0) {
                    res.status(200);
                    res.json(results);
                } else {
                    res.status(404);
                    res.json({"message": "Nenhum Curso foi encontrado!"});
                } 
            }
        }
    });
});

app.put('/cursos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const curso  = req.body.data.curso;
    sql = `UPDATE Cursos SET Curso='${curso}' WHERE id = ${id}`;  
    Banco.conexao.query(sql, (error, results, fields) => {
        if (error) {
            res.status(500);
            res.json({ "message": "Erro Interno do Servidor. Erro.: " + error });
        } else {
            res.status(201);
            res.json({ "message": "Curso "+ req.body.data.curso +" atualizado com sucesso!" });
        }
    });
});

app.delete('/cursos/:id', (req, res) =>{
   Banco.execSQLQuery('DELETE FROM Cursos WHERE id =' + parseInt(req.params.id), req, res);
})
//---------------------------------------------------------------
// Rotas de Matrículas.
app.get('/matriculas/:pag?/:qtdePag?/:nome?', (req, res) => {
    let filter = ''; 
    let pagina =  req.params.pag;
    let qtdePagina =  req.params.qtdePag;
    let nome = req.params.nome;
    let qtdeInicio = 0;
    if(qtdePagina =='T') { qtdePagina = 10 }
    
    qtdeInicio = ( (pagina * qtdePagina) - qtdePagina );

    if(nome != '' && nome != null){
        filter = 'WHERE u.Nome Like "'+ nome +'%"'+' AND u.id in (m.ID_usuario) ';    
    }else{
        filter = 'WHERE u.id in (m.ID_usuario) ';    
    }
    
    sql = 'SELECT distinct u.id, u.nome, (select distinct count(*) from matriculas as ma where u.id = ma.ID_usuario ) as qtde ' +
          'from usuarios as u ' +
          'inner join matriculas as m on m.ID_usuario = u.id ' +
          filter + 'ORDER BY u.nome LIMIT ' + parseInt(qtdeInicio) + ', ' + parseInt(qtdePagina);
    Banco.execSQLQuery(sql , req, res);                     
});

// seleciona os usuários que tem matrículas
app.post('/matriculas/:tip/:id?', (req, res) => {
    let filter = '';
    let sql = '';
    let tipo = req.params.tip;
    let idUsuario = req.params.id;
    
    if (tipo == 'C') {
        if(idUsuario != null){
            filter = ' WHERE m.ID_usuario = '+ parseInt(idUsuario);
        } else {
            filter = ' WHERE u.id in (m.ID_usuario) ';
        }
        
        sql = 'SELECT distinct u.id, u.nome, ' +
       '(select distinct count(*) from matriculas as ma where u.id = ma.ID_usuario ) as qtde ' +
       'from usuarios as u ' +
       'inner join matriculas as m on m.ID_usuario = u.id ' +
        filter + ' order by u.nome'
    }  
   
    Banco.conexao.query(sql, (error, results, fields) => {
        if (error) {
            res.status(500);
            res.json({ "message": "Erro Interno do Servidor. Erro.: " + error });
        } else {
            if (tipo == 'I') {
                res.status(201);
                res.json({ "message": "Matrícula "+ req.body.data.curso +" inserido com sucesso!" });
            }
            else
            {
                if (results.length > 0) {
                    res.status(200);
                    res.json(results);
                } else {
                    res.status(404);
                    res.json({"message": "Nenhuma Matrícula foi encontrada!"});
                } 
            }
        }
    });    
});

// seleciona as matrículas ou a matrícula de um usuário
app.post('/matriculas/cadastro/:tip/:idUser?/:idMatric?', (req, res) => {
    let filter = '';
    let sql = '';
    let tipo = req.params.tip;
    let idUsuario = req.params.idUser;
    let idMatricula  = req.params.idMatric;
    
    if (tipo == 'I') {
        const curso  = req.body.data.curso;
        sql = `INSERT INTO Matriculas(id_usuario, id_curso) VALUES('${idUsuario}','${idCurso}')`;
    }
    else
    {
        if(idUsuario != null && idMatricula == null){
            filter = ' WHERE m.id_usuario = '+ parseInt(idUsuario);
        } else if(idUsuario != null && idMatricula != null){
            filter = ' WHERE m.id_usuario = '+ parseInt(idUsuario) +' AND m.id = '+ parseInt(idMatricula);
        }    
        sql = 'SELECT m.id, m.id_usuario, m.id_curso, date_format(m.data, "%d/%m/%Y") as dataMatric, date_format(m.datinicio, "%d/%m/%Y") as dataInicio, ' +
              'date_format(m.datfim, "%d/%m/%Y") as dataFim, m.status, u.Nome, c.Curso, ' +
              'CASE m.status ' +
              '  WHEN 1 THEN "CURSANDO" ' +
              '  WHEN 2 THEN "CANCELOU" ' +
              '  WHEN 3 THEN "CONCLUIDO" ' +
              '  ELSE "" ' +
              'END AS status ' + 
              'FROM matriculas as m '+
              'inner join usuarios as u on u.id = m.ID_USUARIO ' +
              'inner join cursos as c on c.id = m.ID_CURSO ' +
              filter + ' order by u.nome ';
    }  
   
    Banco.conexao.query(sql, (error, results, fields) => {
        if (error) {
            res.status(500);
            res.json({ "message": "Erro Interno do Servidor. Erro.: " + error });
        } else {
            if (tipo == 'I') {
                res.status(201);
                res.json({ "message": "Matrícula "+ req.body.data.curso +" inserido com sucesso!" });
            }
            else
            {
                if (results.length >= 0) {
                    res.status(200);
                    res.json(results);
                } else {
                    res.status(404);
                    res.json({"message": "Nenhuma Matrícula foi encontrada!"});
                } 
            }
        }
    });    
});

app.put('/matriculas/cadastro/:idUsuario?/:idMatric?', (req, res) =>{
    const idUsuario = parseInt(req.params.idUsuario);
    const idMatric = parseInt(req.params.idMatric);
    const datmatric = req.body.data.datmatric;  
    const datinicio = req.body.data.datinicio;
    const datfim = req.body.data.datfim;
    const id_curso = parseInt(req.body.data.id_curso);
    const status = req.body.data.status; 
    sql ='UPDATE Matriculas SET data = "' + datmatric + '", ' +
                       'datInicio = "' + datinicio + '", ' +
                       'datFim =  "' + datfim + '", ' +
                       'ID_Curso =  ' + id_curso + ', ' +
                       'status = ' + status +
    ' WHERE ID_Usuario = ' + idUsuario + ' AND id = ' + idMatric;  
    Banco.conexao.query(sql, (error, results, fields) => {
        if (error) {
            res.status(500);
            res.json({ "message": "Erro Interno do Servidor. Erro.: " + error });
        } else {
            res.status(201);
            res.json({ "message": "Matricula  "+ req.params.idMatric +"  atualizada com sucesso!" });
        }
    });    
});

app.delete('/matriculas/cadastro/:idUsuario?/:idMatric?', (req, res) =>{
    Banco.execSQLQuery('DELETE FROM Matriculas WHERE ID_Usuario =' + parseInt(req.params.idUsuario) + ' AND ID = ' + parseInt(req.params.idMatric), req, res);
});