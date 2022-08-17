const mysql=require('mysql');
const DbService=require('../services/DbService');

class CommentController{

    constructor()
    {
        this.dbObj = DbService.getInstance();
    }

    GetCommentList(req, res)
    {
        console.log("getting comments...");
        this.dbObj.GetCommentListDb((err, results) => {
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

    GetComment(req, res)
    {
        var id = req.params.id;
        if (!id || isNaN(id)){
            console.log("invalid id");
            return res.status(400).send("invalid ID supplied");
        }
        console.log("getting comment...");
        this.dbObj.GetCommentDb(id, (err, results) => {
            if (err){
                return res.status(500).send({
                    error: err,
                    response: null
                });
                // throw err;
            }
            
            if (!results.length){
                console.log("data not found");
                return res.status(404).send("comment not found");
            }
            res.status(200).send(results);
            console.log("data found!");
        });
    }

    CreateComment(req, res)
    {
        var [postId, name, email, body] = [req.body.postId, req.body.name, req.body.email, req.body.body];
        if (!postId || !name || !email|| !body)
        {
            console.log("request data error!");
            return res.status(400).send("invalid comment");
        }
        console.log("creating comment...");
        this.dbObj.AddCommentDb(postId, name, email, body, (err, results) =>{
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

    UpdateComment(req, res)
    {
        var [name, email, body, id] = [req.body.name, req.body.email, req.body.body, parseInt(req.params.id)];

        if (!id || isNaN(id)){
            console.log("invalid id");
            return res.status(400).send("invalid ID supplied");
        }

        if (!name || !email || !body)
        {
            console.log("request data error!");
            return res.status(400).send("invalid post");
        }

        console.log("checking comment existence...");
        this.dbObj.GetCommentDb(id, (err, results) =>{
            if (err){
                return res.status(500).send({
                    error: err,
                    response: null
                });
                // throw err;
            } 

            if (!results.length){
                console.log("data not found");
                return res.status(404).send("comment not found");
            }
            console.log("updating comment...");
            this.dbObj.UpdateCommentDb(name, email, body, id, (updateErr, updateResults) => {
                if (updateErr){
                    return res.status(500).send({
                        error: updateErr,
                        response: null
                    });
                    // throw err;
                } 
                let responseObj = req.body;
                responseObj.postId = results[0].postId; 
                responseObj.id = id; 
                console.log("updated data!");
                return res.status(200).send(responseObj);
            });
        });
    }

    UpdateCommentInfo(req, res)
    {
        var [name, email, body, id] = [req.body.name, req.body.email, req.body.body, parseInt(req.params.id)];

        if (!id || isNaN(id)){
            console.log("invalid id");
            return res.status(400).send("invalid ID supplied");
        }

        if (!name && !email && !body)
        {
            console.log("request data error!");
            return res.status(400).send("invalid info");
        }

        console.log("checking comment existence...");
        this.dbObj.GetCommentDb(id, (err, results) =>{
            if (err){
                return res.status(500).send({
                    error: err,
                    response: null
                });
                // throw err;
            } 

            if (!results.length){
                console.log("data not found");
                return res.status(404).send("comment not found");
            }
            
            console.log("updating comment information...");
            this.dbObj.UpdateCommentInfoDb(name, email, body, id, (updateErr, updateResults) => {
                if (updateErr){
                    return res.status(500).send({
                        error: err,
                        response: null
                    });
                    // throw err;
                } 

                var resultObj = results[0];
                resultObj.id = id;
                resultObj.postId = resultObj.postId; 
                resultObj.name = name ?? resultObj.name; 
                resultObj.email = email ?? resultObj.email; 
                resultObj.body = body ?? resultObj.body; 

                console.log("updated data!");
                return res.status(200).send(resultObj);
            });
        });
    }

    DeleteComment(req, res)
    {
        var id = req.params.id;

        if (!id || isNaN(id)){
            console.log("invalid id");
            return res.status(400).send("invalid ID supplied");
        }

        var comment;
        this.CheckCommentExistence(id, res, (err, result) => {
            comment = result;
            console.log("deleting comment...");
            this.dbObj.DeleteCommentDb(id, (err, results) => {
                if (err){
                    return res.status(500).send({
                        error: err,
                        response: null
                    });
                    // throw err;
                } 
                console.log("data deleted!");
                return res.status(200).send(comment);
            });
        }); 
    }

    CheckCommentExistence(id, res, callback)
    {
        console.log("checking comment existence...");
        this.dbObj.GetCommentDb(id, (err, results) =>{
            if (err){
                return res.status(500).send({
                    error: err,
                    response: null
                });
                // throw err;
            } 

            if (!results.length){
                console.log("data not found");
                return res.status(404).send("comment not found");
            }
            console.log("comment found with id: " + results[0].id);
            callback(err, results[0]);
        });
    } 
}

module.exports=CommentController;