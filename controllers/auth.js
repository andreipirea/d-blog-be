const db = require("../util/database");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed");
    error.statuscode = 422;
    throw error;
  }
  const password = req.body.password;

  try {
    const salt = await bcrypt.genSaltSync();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = {
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    };

    let sql = "INSERT INTO users SET ?";
    db.query(sql, user, (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  } catch (err) {
    throw err;
  }
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

    const token = jwt.sign({
      email: foundUser.email,
      password: foundUser.password
    }, 'somesupersecretsecret', {expiresIn: '1h'});

    if (isEquel) {
      res.status(200).json({token: token, userId: foundUser.id.toString()});
    }
    
  });
};