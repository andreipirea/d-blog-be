const db = require("../util/database");
const fileHelper = require("../util/file");

exports.addSlide = (req, res) => {
  let post = {
    title: req.body.title,
    content: req.body.content,
    imageUrl: req.file !== undefined ? req.file.path.toString() : ""
  };

  let sql = "INSERT INTO carousel SET ?";
  db.query(sql, post, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
};

exports.getSlides = (req, res) => {
  let sql = "SELECT * FROM carousel";
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

exports.updateSlide = (req, res) => {
  console.log("req body", req.body);

  let selectedPost = `SELECT * FROM carousel WHERE id = ${req.params.id}`;
  db.query(selectedPost, (err, result) => {
    if (err) throw err;

    if (req.file && result[0].imageUrl !== "") {
      fileHelper.deleteFile(result[0].imageUrl);
    }

    let path =
      req.file !== undefined ? req.file.path.toString() : result[0].imageUrl;
    path = path.replace(/\\/g, "\\\\");

    const title = req.body.title;
    const content = req.body.content;
    const imageUrl = path;

    let sql = `UPDATE carousel SET title = '${title}', content = '${content}', imageUrl = '${imageUrl}' WHERE id = ${req.params.id}`;
    // sql = sql.replace(/"/g, "");
    // console.log("SQL", sql);

    db.query(sql, (err, result) => {
      if (err) throw err;
      res.json({ message: "post updated..." });
    });
  });
};

exports.deleteSlide = (req, res) => {
  let selectedPost = `SELECT * FROM carousel WHERE id = ${req.params.id}`;
  let query = db.query(selectedPost, (err, result) => {
    if (err) throw err;
    if (result[0].imageUrl !== "") {
      fileHelper.deleteFile(result[0].imageUrl);
    }
  });

  let sql = `DELETE FROM carousel WHERE id = ${req.params.id}`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.status(200).json({ message: "Post deleted" });
  });
};
