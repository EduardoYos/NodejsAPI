const mysql=require('mysql');
const DbService=require('../services/DbService');

class PostController{

    constructor()
    {
        // this.DbObj = new DbService();
        this.dbObj = DbService.getInstance();
        // this.sql=mysql.createPool({
        //     host:'localhost',
        //     user:'root',
        //     password:'',
        //     port:3306
        //  });
        //  this.sql.query("use nodejsapi");
        //  console.log("DB started!");
    }

    GetPostList(req, res)
    {
        console.log("getting posts...");
        this.dbObj.GetPostListDb((err, results) => {
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
    }

    GetPost(req, res)
    {
        console.log("getting post...");
        this.dbObj.GetPostDb(req.params.id, (err, results) => {
            if (err){
                return res.status(500).send({
                    error: err,
                    response: null
                });
                // throw err;
            }
            
            if (!results.length){
                console.log("data not found");
                return res.status(404).send("post not found");
            }
            res.status(200).send(results);
            console.log("data found!");
        });
    }

    GetPostWithComments(req, res)
    {
        console.log("getting post and comments...");
        this.dbObj.GetPostWithCommentsDb(req.params.id, (err, postResult, commentResult) => {
            if (err){
                return res.status(500).send({
                    error: err,
                    response: null
                });
                // throw err;
            }
            postResult["comments"] = commentResult;
            res.status(200).send({
                post: postResult,
                comments: commentResult
            });
            console.log("data found!");
        });
    }

    GetPostListWithText(req, res)
    {
        if(req.query.with_text != undefined){
            console.log("getting posts with text...");
            let stringObj = "%" + req.query.with_text + "%";
            
            this.dbObj.GetPostListWithTextDb(stringObj, (err, results) => {
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
        }
    }

    CreatePost(req, res)
    {
        var [userId, title, body] = [req.body.userId, req.body.title, req.body.body];
        if (!userId || !title || !body)
        {
            console.log("request data error!");
            return res.status(400).send("invalid post");
        }
        console.log("creating post...");
        this.dbObj.AddPostDb(userId, title, body, (err, results) =>{
            if (err){
                console.log("database query error!");
                return res.status(500).send({
                    error: err,
                    response: null
                });
                // throw err;
            } 
            let responseObj = req.body;
            responseObj.id = results.insertId; 
            res.status(201).send(responseObj);
            console.log("data inserted!");
        });
    }
    
    UpdatePost(req, res)
    {
        var [userId, title, body, id] = [req.body.userId, req.body.title, req.body.body, parseInt(req.params.id)];

        if (!id || isNaN(id)){
            console.log("invalid id");
            return res.status(400).send("invalid ID supplied");
        }

        if (!userId || !title || !body)
        {
            console.log("request data error!");
            return res.status(400).send("invalid post");
        }

        console.log("checking post existence...");
        this.dbObj.GetPostDb(id, (err, results) =>{
            if (err){
                return res.status(500).send({
                    error: err,
                    response: null
                });
                // throw err;
            } 

            if (!results.length){
                console.log("data not found");
                return res.status(404).send("post not found");
            }
            console.log("updating post...");
            this.dbObj.UpdatePostDb(userId, title, body, id, (updateErr, updateResults) => {
                if (updateErr){
                    return res.status(500).send({
                        error: updateErr,
                        response: null
                    });
                    // throw err;
                } 
                let responseObj = req.body;
                responseObj.id = id; 
                console.log("updated data!");
                return res.status(200).send(responseObj);
            });
        });
    }

    UpdatePostInfo(req, res)
    {
        var [userId, title, body, id] = [req.body.userId, req.body.title, req.body.body, parseInt(req.params.id)];

        if (!id || isNaN(id)){
            console.log("invalid id");
            return res.status(400).send("invalid ID supplied");
        }

        if (!userId && !title && !body)
        {
            console.log("request data error!");
            return res.status(400).send("invalid info");
        }

        console.log("checking post existence...");
        this.dbObj.GetPostDb(id, (err, results) =>{
            if (err){
                return res.status(500).send({
                    error: err,
                    response: null
                });
                // throw err;
            } 

            if (!results.length){
                console.log("data not found");
                return res.status(404).send("post not found");
            }
            
            console.log("updating post information...");
            this.dbObj.UpdatePostInfoDb(userId, title, body, id, (updateErr, updateResults) => {
                if (updateErr){
                    return res.status(500).send({
                        error: err,
                        response: null
                    });
                    // throw err;
                } 

                var resultObj = results[0];
                resultObj.id = id;
                resultObj.userId = userId ?? resultObj.userId; 
                resultObj.title = title ?? resultObj.title; 
                resultObj.body = body ?? resultObj.body; 

                console.log("updated data!");
                return res.status(200).send(resultObj);
            });
        });
    }
        
    DeletePost(req, res)
    {
        var id = req.params.id;

        if (!id || isNaN(id)){
            console.log("invalid id");
            return res.status(400).send("invalid ID supplied");
        }

        var post;
        this.CheckPostExistence(id, res, (err, result) => {
            post = result;
            console.log("deleting post...");
            this.dbObj.DeletePostDb(id, (err, results) => {
                if (err){
                    return res.status(500).send({
                        error: err,
                        response: null
                    });
                    // throw err;
                } 
                console.log("data deleted!");
                return res.status(200).send(post);
            });
        }); 
    }

    CheckPostExistence(id, res, callback)
    {
        console.log("checking post existence...");
        this.dbObj.GetPostDb(id, (err, results) =>{
            if (err){
                return res.status(500).send({
                    error: err,
                    response: null
                });
                // throw err;
            } 

            if (!results.length){
                console.log("data not found");
                return res.status(404).send("post not found");
            }
            console.log("post found with id: " + results[0].id);
            callback(err, results[0]);
        });
    }  
}

module.exports=PostController;