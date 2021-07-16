const mysql = require("mysql");


const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "d-blog"
});

module.exports = pool;

// const db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "d-blog"
// });

// db.connect((err) => {
//   if (err) {
//     throw err;
//   }
//   console.log("mysql connected");
// });