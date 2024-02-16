const mysql = require("mysql");


const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "d-blog"
});

// const pool = mysql.createPool({
//   host: "eu-cdbr-west-01.cleardb.com",
//   user: "b7966ec5a73a73",
//   password: "70b71ebc",
//   database: "heroku_e8ce7f018aca5a4"
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