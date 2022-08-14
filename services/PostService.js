const { json } = require('body-parser');
const mysql=require('mysql');

class PostService{

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

    GetPostList(req, res)
    {
        console.log("getting posts...");
        this.sql.getConnection((err,connection) => {
            connection.query("select * from posts order by id asc", (err,results,fields) => {
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

    GetPost(req, res)
    {
        console.log("getting post...");
        this.sql.getConnection((err,connection) => {   
            connection.query("select * from posts where id=? order by id asc",[req.params.id], (err,results,fields) => {
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

    GetPostWithComments(req, res)
    {
        console.log("getting post and comments...");
        this.sql.getConnection((err,connection) => {   
            connection.query("select * from posts where id=? order by id asc",[req.params.id], (err, postResult, fields) => {
                connection.query("select * from comments where postId=? order by id asc", 
                [postResult[0].id], (err, commentResult, fields) => {
                    connection.release();
                    if (err){
                        return res.status(500).send({
                            error: err,
                            response: null
                        });
                        // throw err;
                    }
                    postResult["comments"] = commentResult;
                    // console.log(postResult);
                    res.status(200).send({
                        post: postResult,
                        comments: commentResult
                    });
                    // res.status(200).send(postResult);
                    console.log("data found!");
                });
            }); 
        });
    }

    GetPostListWithText(req, res)
    {
        if(req.query.with_text != undefined){
            console.log("getting posts with text...");
            let stringObj = "%" + req.query.with_text + "%";
            
            this.sql.getConnection((err,connection) => {   
                // connection.query("select * from posts where body like '%?%'", stringObj, (err, result, fields) => {
                connection.query("select * from posts where body like ?", [stringObj], (err, result, fields) => {
                    connection.release();
                    if (err){
                        return res.status(500).send({
                            error: err,
                            response: null
                        });
                        // throw err;
                    }
                    res.status(200).send(result);
                    console.log("data found!");
                });
            });
        }
    }

    AddPost(req, res)
    {
        console.log("creating post...");
        this.sql.getConnection(function(err,connection){
            connection.query("insert into posts (userId, title, body) values (?, ?, ?)",[req.body.userId,req.body.title,req.body.body]);
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

    UpdatePost(req, res)
    {
        console.log("updating post...");
        this.sql.getConnection((err, connection) => {
            connection.query("update posts set userId=?, title=?, body=? where id=?", [req.body.userId, req.body.title, req.body.body, req.params.id]);
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

    UpdatePostInfo(req, res)
    {
        console.log("updating post information...");
        this.sql.getConnection((err, connection) => {
            if(req.params.id){
                if(req.body.userId && req.body.title && req.body.body){
                    connection.query("update posts set userId=?, title=?, body=? where id=?", [req.body.userId, req.body.title, req.body.body, req.params.id]);
                }
                else {
                    if(req.body.userId){
                        connection.query("update posts set userId=? where id=?", [req.body.userId, req.params.id]);
                    }
                    if(req.body.title){
                        connection.query("update posts set title=? where id=?", [req.body.title, req.params.id]);
                    }
                    if(req.body.body){
                        connection.query("update posts set body=? where id=?", [req.body.body, req.params.id]);
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

    DeletePost(req, res)
    {
        console.log("deleting post...");
        this.sql.getConnection((err, connection) => {
            connection.query("delete from posts where id=?", [req.params.id]);
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

module.exports=PostService;