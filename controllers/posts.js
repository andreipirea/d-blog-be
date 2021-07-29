const db = require('../util/database');



exports.addPost = (req, res) => {
  // console.log(req.file.path);
  if (!req.file) {
    const error = new Error('No image provided');
    error.statusCode = 422;
    throw error;
  }
  let post = {
    title: req.body.title,
    content: req.body.content,
    link: req.body.link,
    imageUrl: req.file !== undefined ? req.file.path.toString() : ""
  };
  console.log(post);

  let sql = "INSERT INTO posts SET ?";
  db.query(sql, post, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send(result);
  });
}

exports.getPosts = (req, res) => {
  let sql = "SELECT * FROM posts";
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    console.log(results);
    res.status(200).json(results);
  });
};

exports.getPost = (req, res) => {
  let sql = `SELECT * FROM posts WHERE id = ${req.params.id}`;
  let query = db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.status(200).json(result);
  });
};

exports.updatePost = (req, res) => {
  let newTitle = "updated title";
  let sql = `UPDATE posts SET title = '${newTitle}' WHERE id = ${req.params.id}`;
  let query = db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send("post updated...");
  });
};

exports.deletePost = (req, res) => {
  let sql = `DELETE FROM posts WHERE id = ${req.params.id}`;
  let query = db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send("post deleted...");
  });
};