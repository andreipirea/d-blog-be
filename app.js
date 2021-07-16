const express = require("express");

const db = require('./util/database');
const articlesRoutes = require("./routes/posts");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type",
    "Authorization"
  );
  next();
});

app.use(articlesRoutes);

db.getConnection((err, connection) => {
  if (err) {
    throw err;
  }
  console.log("mysql connected");
});

app.listen(4000);
