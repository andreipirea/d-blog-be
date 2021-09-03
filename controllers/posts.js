const db = require("../util/database");
const fileHelper = require("../util/file");


exports.addPost = (req, res) => {
  let post = {
    title: req.body.title,
    content: req.body.content,
    link: req.body.link,
    imageUrl: req.file !== undefined ? req.file.path.toString() : ""
  };

  let sql = "INSERT INTO posts SET ?";
  db.query(sql, post, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
};

exports.getPosts = (req, res) => {
  let sql = "SELECT * FROM posts";
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.status(200).json(results);
  });
};

// exports.getPost = (req, res) => {
//   let sql = `SELECT * FROM posts WHERE id = ${req.params.id}`;
//   let query = db.query(sql, (err, result) => {
//     if (err) throw err;
//     res.status(200).json(result);
//   });
// };

exports.updatePost = (req, res) => {
  const removeImage = req.body.removeImage;
  console.log("req body", req.body);
  
  let selectedPost = `SELECT * FROM posts WHERE id = ${req.params.id}`;
  db.query(selectedPost, (err, result) => {
    if (err) throw err;
    
    if (req.file && result[0].imageUrl !== "") {
      fileHelper.deleteFile(result[0].imageUrl);
    }
    

    let path = req.file !== undefined ? req.file.path.toString() : removeImage === 'true'  ? "" : result[0].imageUrl;
    path = path.replace(/\\/g, "\\\\");
    
    
    const title = req.body.title;
    const content = req.body.content;
    const link = req.body.link;
    const imageUrl = path;

    if (removeImage === 'true' && result[0].imageUrl) {
      fileHelper.deleteFile(result[0].imageUrl);
    }

    console.log("image Url", imageUrl);
   
  
    let sql = `UPDATE posts SET title = "${title}", content = "${content}", link = "${link}", imageUrl = "${imageUrl}" WHERE id = ${req.params.id}`;
  
    db.query(sql, (err, result) => { 
      if (err) throw err;
      res.json({message: "post updated..."});
    });
  });

};

exports.deletePost = (req, res) => {
  let selectedPost = `SELECT * FROM posts WHERE id = ${req.params.id}`;
  let query = db.query(selectedPost, (err, result) => {
    if (err) throw err;
    if (result[0].imageUrl !== "") {
      fileHelper.deleteFile(result[0].imageUrl);
    }
  });

  let sql = `DELETE FROM posts WHERE id = ${req.params.id}`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.status(200).json({ message: "Post deleted" });
  });
};
