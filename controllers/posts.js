const db = require("../util/database");
const fileHelper = require("../util/file");


exports.addPost = (req, res) => {
  let galleryArray = [];
  if (req.files.postCarousel) {
    req.files.postCarousel.forEach(img => {
      galleryArray.push(img.path);
    })
  }
  let post = {
    title: req.body.title,
    content: req.body.content,
    link: req.body.link,
    imageUrl: req.files.imageUrl !== undefined ? req.files.imageUrl[0].path.toString() : "",
    imageGallery: req.files.postCarousel ? galleryArray.join(",") : ""
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
  let galleryArray = [];
  let dbGalleryPaths = [];
  // console.log("req body", req.files);
  
  let selectedPost = `SELECT * FROM posts WHERE id = ${req.params.id}`;
  db.query(selectedPost, (err, result) => {
    if (err) throw err;
    
    if (req.files.imageUrl && result[0].imageUrl !== "") {
      if (req.files.imageUrl[0].path.toString() !== result[0].imageUrl) {
        fileHelper.deleteFile(result[0].imageUrl);
      }
    }

    if (req.files.postCarousel) {
      req.files.postCarousel.forEach(img => {
        galleryArray.push(img.path);
      })
    }
    if (result[0].imageGallery !== "") {
      dbGalleryPaths = result[0].imageGallery.split(',');
      console.log("paths from db", dbGalleryPaths);
      console.log("path from req", galleryArray);
      dbGalleryPaths.forEach(imgPath => {
        console.log("image path", imgPath);
        if (!galleryArray.includes(imgPath)) {
          fileHelper.deleteFile(imgPath);
        }
      });
    }
    
    
    const title = req.body.title;
    const content = req.body.content;
    const link = req.body.link;
    const imageUrl = req.files.imageUrl ? req.files.imageUrl[0].path.toString().replace(/\\/g, "\\\\") : "";
    const imageGallery = req.files.postCarousel ? galleryArray.join(",").replace(/\\/g, "\\\\") : ""

    console.log("image Url", imageUrl);
    console.log("image gallery", imageGallery);
   
  
    let sql = `UPDATE posts SET title = \'${title}\', content = \'${content}\', link = \'${link}\', imageUrl = \'${imageUrl}\', imageGallery = \'${imageGallery}\' WHERE id = ${req.params.id}`;
  
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
    if (result[0].imageGallery !== "") {
      let galleryArr = result[0].imageGallery.split(',');
      galleryArr.forEach(url => {
        fileHelper.deleteFile(url);
      });
    }
  });

  let sql = `DELETE FROM posts WHERE id = ${req.params.id}`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.status(200).json({ message: "Post deleted" });
  });
};
