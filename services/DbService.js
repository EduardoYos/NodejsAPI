// const mysql=require('mysql');

// class DbService{

//     constructor()
//     {
//         this.sql=mysql.createPool({
//             host:'localhost',
//             user:'root',
//             password:'',
//             port:3306
//          });
//          this.sql.query("use nodejsapi");
//          console.log("DB started!");
//     }

//     GetPost(postId, callback)
//     {
//         this.sql.getConnection((err,connection) => {   
//             connection.query("select * from posts where id=? order by id asc",[postId], (err,results,fields) => {
//                 connection.release();
//                 callback(err, results);
//             });
//         }); 
//     }
// }

// module.exports = DbService;
const mysql=require('mysql');

class DbService {

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

    //#region POST METHODS
    GetPostListDb(callback)
    {
        this.sql.getConnection((err,connection) => {
            connection.query("select * from posts order by id asc", (err,results,fields) => {
                connection.release();
                callback(err, results);
            });
        });
    }

    GetPostDb(postId, callback)
    {
        this.sql.getConnection((err,connection) => {   
            connection.query("select * from posts where id=? order by id asc",[postId], (err,results,fields) => {
                connection.release();
                callback(err, results);
            });
        }); 
    }

    GetPostWithCommentsDb(id, callback)
    {
        this.sql.getConnection((err,connection) => {   
            connection.query("select * from posts where id=? order by id asc",[id], (err, postResult, fields) => {
                connection.query("select * from comments where postId=? order by id asc", 
                [postResult[0].id], (err, commentResult, fields) => {
                    connection.release();
                    callback(err, postResult, commentResult);
                });
            }); 
        });
    }

    GetPostListWithTextDb(stringObj, callback)
    {
        this.sql.getConnection((err,connection) => {   
            connection.query("select * from posts where body like ?", [stringObj], (err, results, fields) => {
                connection.release();
                callback(err, results);
            });
        });
    }

    AddPostDb(userId, title, body, callback)
    {
        this.sql.getConnection((err,connection) => {
            connection.query("insert into posts (userId, title, body) values (?, ?, ?)",[userId, title, body], (err, result, fields) => {
                connection.release();
                callback(err, result);
            });
        });
    }

    UpdatePostDb(userId, title, body, id, callback)
    {
        this.sql.getConnection((err, connection) => {
            connection.query("update posts set userId=?, title=?, body=? where id=?", [userId, title, body, id], (err, result, fields) => {
                connection.release();
                callback(err, result);
            });
        });
    }
    
    UpdatePostInfoDb(userId, title, body, id, callback)
    {
        var postResult;
        this.sql.getConnection((err, connection) => {
            if(userId && title && body){
                connection.query("update posts set userId=?, title=?, body=? where id=?", [userId, title, body, id], (err, result, fields) => {
                    postResult = result;
                });
            }
            else {
                if(userId){
                    connection.query("update posts set userId=? where id=?", [userId, id], (err, result, fields) => {
                        postResult = result;
                    });
                }
                if(title){
                    connection.query("update posts set title=? where id=?", [title, id], (err, result, fields) => {
                        postResult = result;
                    });
                }
                if(body){
                    connection.query("update posts set body=? where id=?", [body, id], (err, result, fields) => {
                        postResult = result;
                    });
                }
            }
            connection.release();
            callback(err, postResult);
        });
    }

    DeletePostDb(id, callback)
    {
        this.sql.getConnection((err, connection) => {
            connection.query("delete from posts where id=?", [id], (err, result) => {
                connection.release();
                callback(err, result);
            });
        });
    }
    //#endregion

    //#region COMMENT METHODS
    GetCommentListDb(callback)
    {
        this.sql.getConnection((err,connection) => {
            connection.query("select * from comments order by id asc", (err, results, fields) =>{
                connection.release();
                callback(err, results);
            });
        });
    }

    GetCommentDb(commentId, callback)
    {
        this.sql.getConnection((err,connection) => {   
            connection.query("select * from comments where id=? order by id asc",[commentId], (err,results,fields) => {
                connection.release();
                callback(err, results);
            });
        }); 
    }

    AddCommentDb(postId, name, email, body, callback)
    {
        this.sql.getConnection((err,connection) => {
            connection.query("insert into comments (postId, name, email, body) values (?, ?, ?, ?)",[postId, name, email, body], (err, result, fields) => {
                connection.release();
                callback(err, result);
            });
        });
    }

    UpdateCommentDb(name, email, body, id, callback)
    {
        this.sql.getConnection((err, connection) => {
            connection.query("update comments set name=?, email=?, body=? where id=?", [name, email, body, id], (err, result, fields) => {
                connection.release();
                callback(err, result);
            });
        });
    }
    
    UpdateCommentInfoDb(name, email, body, id, callback)
    {
        var commentResult;
        this.sql.getConnection((err, connection) => {
            if(name && email && body){
                connection.query("update comments set name=?, email=?, body=? where id=?", [name, email, body, id], (err, result, fields) => {
                    commentResult = result;
                });
            }
            else {
                if(name){
                    connection.query("update comments set name=? where id=?", [name, id], (err, result, fields) => {
                        commentResult = result;
                    });
                }
                if(email){
                    connection.query("update comments set email=? where id=?", [email, id], (err, result, fields) => {
                        commentResult = result;
                    });
                }
                if(body){
                    connection.query("update comments set body=? where id=?", [body, id], (err, result, fields) => {
                        commentResult = result;
                    });
                }
            }
            connection.release();
            callback(err, commentResult);
        });
    }

    DeleteCommentDb(id, callback)
    {
        this.sql.getConnection((err, connection) => {
            connection.query("delete from comments where id=?", [id], (err, result) => {
                connection.release();
                callback(err, result);
            });
        });
    }

    //#endregion
}
  



  const Singleton = (() => {
    var instance;
  
    function createInstance() {
      var classObj = new DbService();
      return classObj;
    }
  
    return {
      getInstance: () => {
          if (!instance) {
              instance = createInstance();
          }
          return instance;
      },
    };
  })();
  
  module.exports = Singleton;