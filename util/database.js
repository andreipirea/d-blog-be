const mysql = require("mysql");


const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "d-blog"
});

// const pool = mysql.createPool({
//   host: "eu-cdbr-west-01.cleardb.com",
//   user: "b0879c2b93cbb7",
//   password: "4d89a313",
//   database: "heroku_4187931d1ef1174"
// });
 
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