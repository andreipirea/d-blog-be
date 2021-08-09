const db = require("../util/database");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

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

  // bcrypt.hash(password, 12)
  //   .then(hashedPassword => {

  //   })
  //   .catch(err => {
  //     if (err.statusCode) {
  //       err.statuscode = 500;
  //     }
  //     next(err);
  //   })
};
