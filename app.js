const express=require('express');
// const mysql=require('mysql');
const bodyParser=require('body-parser');
const app=express();

const CommentController=require('./controllers/CommentController');
const PostController=require('./controllers/PostController');

let commentObj = new CommentController();
let postObj = new PostController();

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// const sql=mysql.createPool({
//     host:'localhost',
//     user:'root',
//     password:'',
//     port:3306
//  });
//  sql.query("use nodejsapi");

 var baseUrl = "/api";

//Post Routes
app.get(baseUrl, (req,res) => {
    res.send("Aplication start");
});

app.get(baseUrl + "/posts", (req, res) => {
    if(req.query.with_text != undefined) {
        // res.status(200).send(req.query.with_text);
        postObj.GetPostListWithText(req, res);
    }
    else{
        postObj.GetPostList(req,res);
    }
});

// app.get(baseUrl + "/posts/:id?", (req, res) => {
//     postObj.GetPost(req, res);
// });

app.get(baseUrl + "/posts/:id", (req, res) => {
    if(req.query.with_comments != undefined) {
        postObj.GetPostWithComments(req, res);
    }
    else{
        postObj.GetPost(req, res);
    }
});

app.post(baseUrl + "/posts", (req, res) => {
    postObj.CreatePost(req, res);
});

 
app.put(baseUrl + "/posts/:id", (req, res) => {
    postObj.UpdatePost(req, res);
});

app.patch(baseUrl + "/posts/:id", (req, res) => {
    postObj.UpdatePostInfo(req, res);
});

app.delete(baseUrl + "/posts/:id", (req, res) => {
    postObj.DeletePost(req, res);
});



//Comment Routes
app.get(baseUrl + "/comments", (req, res) => {
    commentObj.GetCommentList(req, res);
});

app.get(baseUrl + "/comments/:id?", (req, res) => {
    commentObj.GetComment(req, res);
});

app.post(baseUrl + "/comments", (req, res) => {
    commentObj.CreateComment(req, res);
});

app.patch(baseUrl + "/comments/:id", (req, res) => {
    commentObj.UpdateCommentInfo(req, res);
});

app.delete(baseUrl + "/comments/:id", (req, res) => {
    commentObj.DeleteComment(req, res);
});

app.put(baseUrl + "/comments/:id", (req, res) => {
    commentObj.UpdateComment(req, res);
});

 //Database
let port=process.env.PORT || 3000;

//Start server
app.listen(port,function(req,res){
    console.log('Server is running!');
 });