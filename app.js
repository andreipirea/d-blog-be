const express = require("express");

const db = require('./util/database');
const articlesRoutes = require("./routes/posts");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(articlesRoutes);

db.getConnection((err, connection) => {
  if (err) {
    throw err;
  }
  console.log("mysql connected");
});

app.listen(4000);
