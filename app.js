const express=require('express');
const mysql=require('mysql');
const bodyParser=require('body-parser');
const app=express();

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

const sql=mysql.createPool({
    host:'localhost',
    user:'root',
    password:'',
    port:3306
 });
 sql.query("use nodejsapi");

 var baseUrl = "/api";
//Routes
app.get(baseUrl, function(req,res){
    res.send("Início da Aplicação");
});

app.get(baseUrl + "/posts", (req, res) => {
    // GetUser(req,res)
    // {
        // if(!req.params.id){
            sql.getConnection((err,connection) => {
                connection.query("select * from posts order by id asc", function(err,results,fields){
                    if (err) throw err;
                    res.send({results});
                    connection.release();
                });
            });
        // }
        // else{
        //     this.sql.getConnection(function(err,connection){
        //         sql.query("select * from user where id=? order by id asc",[req.params.id],function(err,results,fields){
        //             res.render('select',{data:results});
        //         });
        //     });
        // }
    // }

});

app.post(baseUrl + "/posts", (req, res) => {
        sql.getConnection(function(err,connection){
            connection.query("insert into posts (userId, title, body) values (?, ?, ?)",[req.body.userId,req.body.title,req.body.body]);
            if (err) throw err;
            connection.release();
    });
    res.send(req.body);
    console.log("dados inseridos!");
  });






 //Database
let port=process.env.PORT || 3000;

//Start server
app.listen(port,function(req,res){
    console.log('Servidor está rodando!');
 });