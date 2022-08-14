const mysql=require('mysql');

class CommentService{

    constructor()
    {
        this.sql=mysql.createPool({
            host:'localhost',
            user:'root',
            password:'',
            port:3306
         });
        this.sql.query("use nodejsapi");
        console.log("DB started!");
    }

    GetCommentList(req, res)
    {
        console.log("getting comments...");
        this.sql.getConnection((err,connection) => {
            connection.query("select * from comments order by id asc", (err, results, fields) =>{
                connection.release();
                if (err){
                    return res.status(500).send({
                        error: err,
                        response: null
                    });
                    // throw err;
                }
                res.status(200).send(results);
                console.log("data found!");
            });
        });
    }

    GetComment(req, res)
    {
        console.log("getting comment...");
        this.sql.getConnection((err,connection) => {   
            connection.query("select * from comments where id=? order by id asc",[req.params.id], (err,results,fields) => {
                connection.release();
                if (err){
                    return res.status(500).send({
                        error: err,
                        response: null
                    });
                    // throw err;
                }
                res.status(200).send(results);
            });
        }); 
    }

    AddComment(req, res)
    {
        console.log("creating comment...");
        this.sql.getConnection((err,connection) => {
            connection.query("insert into comments (postId, name, email, body) values (?, ?, ?, ?)", [req.body.postId, req.body.name, req.body.email, req.body.body]);
            connection.release();
            if (err){
                return res.status(500).send({
                    error: err,
                    response: null
                });
                // throw err;
            } 
            res.status(201).send(req.body);
            console.log("data inserted!");
        });
    }    

    UpdateComment(req, res)
    {
        console.log("updating comment...");
        this.sql.getConnection((err, connection) => {
            connection.query("update comments set name=?, email=?, body=? where id=?", [req.body.name, req.body.email, req.body.body, req.params.id]);
            connection.release();
            if (err){
                return res.status(500).send({
                    error: err,
                    response: null
                });
                // throw err;
            } 
            res.status(200).send(req.body);
            console.log("updated data!");
        });
    }

    UpdateCommentInfo(req, res)
    {
        console.log("updating comment information...");
        this.sql.getConnection((err, connection) => {
            if(req.params.id){
                if(req.body.name && req.body.email && req.body.body){
                    connection.query("update comments set name=?, email=?, body=? where id=?", [req.body.name, req.body.email, req.body.body, req.params.id]);
                }
                else {
                    if(req.body.name){
                        connection.query("update comments set name=? where id=?", [req.body.name, req.params.id]);
                    }
                    if(req.body.email){
                        connection.query("update comments set email=? where id=?", [req.body.email, req.params.id]);
                    }
                    if(req.body.body){
                        connection.query("update comments set body=? where id=?", [req.body.body, req.params.id]);
                    }
                }
            }
            connection.release();
            if (err){
                return res.status(500).send({
                    error: err,
                    response: null
                });
                // throw err;
            } 
            res.status(200).send(req.body);
            console.log("updated data!");
        });
    }

    DeleteComment(req, res)
    { 
        console.log("deleting comment...");
        this.sql.getConnection((err,connection) => {
            connection.query("delete from comments where id=?", [req.params.id]);
            connection.release();
            if (err){
                return res.status(500).send({
                    error: err,
                    response: null
                });
            // throw err;
            } 
            res.status(200).send(req.body);
            console.log("data deleted!");
        });
    }

}

module.exports=CommentService;