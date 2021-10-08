const db = require("../util/database");
const fileHelper = require("../util/file");

exports.addAboutPage = (req, res) => {
  let aboutPage = {
    title: req.body.title,
    content: req.body.content,
    imageUrl: req.files.imageUrl !== undefined ? req.files.imageUrl[0].path.toString() : ""
  };

  let sql = "INSERT INTO about SET ?";
  db.query(sql, aboutPage, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
};

exports.getAboutPage = (req, res) => {
  let sql = "SELECT * FROM about";
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.status(200).json(results);
  });
};

exports.updateAboutPage = (req, res) => {
  console.log("req body", req.body);

  let selectedPost = `SELECT * FROM about WHERE id = ${req.params.id}`;
  db.query(selectedPost, (err, result) => {
    if (err) throw err;

    if (req.files.imageUrl && result[0].imageUrl !== "") {
      if (req.files.imageUrl[0].path.toString() !== result[0].imageUrl) {
        fileHelper.deleteFile(result[0].imageUrl);
      }
    }

    // let path =
    //   req.file !== undefined ? req.file.path.toString() : result[0].imageUrl;
    // path = path.replace(/\\/g, "\\\\");

    const title = req.body.title;
    const content = req.body.content;
    const imageUrl = req.files.imageUrl ? req.files.imageUrl[0].path.toString().replace(/\\/g, "\\\\") : "";

    let sql = `UPDATE about SET title = '${title}', content = '${content}', imageUrl = '${imageUrl}' WHERE id = ${req.params.id}`;
    // sql = sql.replace(/"/g, "");
    // console.log("SQL", sql);

    db.query(sql, (err, result) => {
      if (err) throw err;
      res.json({ message: "post updated..." });
    });
  });
};
