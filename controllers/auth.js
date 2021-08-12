const db = require("../util/database");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res, next) => {
  let userExists;
  let selectSql = `SELECT * FROM users WHERE  email = '${req.body.email}'`;
  await db.query(selectSql, async (err, result) => {
    if (result.length !== 0) {
      userExists = result[0];
      const error = new Error("Exista deja un user cu acest email");
      error.statusCode = 401;
      next(error);
    }
  });

  
  const password = req.body.password;
  const salt = await bcrypt.genSaltSync();
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = {
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword
  };

  const token = jwt.sign(
    {
      email: user.email,
      password: user.password
    },
    "somesupersecretsecret",
    { expiresIn: "1h" }
  );

  let insertSql = "INSERT INTO users SET ?";
  db.query(insertSql, user, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.status(200).json({ token: token, userId: result.insertId.toString() });
  });
};

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let foundUser;

  let sql = `SELECT * FROM users WHERE  email = '${email}'`;

  db.query(sql, async (err, result) => {
    if (result.length === 0) {
      const error = new Error("A user with this email could not be found!");
      error.statusCode = 401;
      next(error);
    }
    foundUser = result[0];

    const isEquel = await bcrypt.compare(password, foundUser.password);

    const token = jwt.sign(
      {
        email: foundUser.email,
        password: foundUser.password
      },
      "somesupersecretsecret",
      { expiresIn: "1h" }
    );

    if (isEquel && !userExists) {
      res.status(200).json({ token: token, userId: foundUser.id.toString() });
    }
  });
};
