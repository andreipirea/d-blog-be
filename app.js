require("dotenv").config();
const express = require("express");
const path = require("path");
const fs = require("fs");
const helmet = require("helmet");
const compression = require("compression");
const db = require("./util/database");
const multer = require("multer");
const articlesRoutes = require("./routes/posts");
const carouselRoutes = require("./routes/carousel");
const authRoutes = require("./routes/auth");
const aboutRoutes = require("./routes/about");
const contactRoutes = require("./routes/contact");

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
  next();
});

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    // console.log("req files ", req.files);
    let name;
    if (
      (req.files.postCarousel &&
        fs.existsSync(`./images/${file.originalname}`)) ||
      (req.files.imageUrl && fs.existsSync(`./images/${file.originalname}`))
    ) {
      name = file.originalname;
    } else {
      name = Date.now() + "-" + file.originalname;
    }

    cb(null, name);
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).fields([
    { name: "imageUrl" },
    { name: "postCarousel" }
  ])
);

app.use("/images", express.static(path.join(__dirname, "images")));

app.use(articlesRoutes);
app.use(carouselRoutes);
app.use(aboutRoutes);
app.use(contactRoutes);
app.use("/auth", authRoutes);

app.use(helmet());
app.use(compression());

db.getConnection((err, connection) => {
  if (err) {
    throw err;
  }
  console.log("mysql connected");
});

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message: message });
});

app.listen(4000);
