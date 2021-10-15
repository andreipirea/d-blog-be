const db = require("../util/database");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
  service: 'yahoo',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.signup = async (req, res, next) => {
  let selectSql = `SELECT * FROM users WHERE  email = '${req.body.email}'`;
  await db.query(selectSql, async (err, result) => {
    if (result.length !== 0) {
      const error = new Error("Exista deja un user cu acest email");
      error.statusCode = 401;
      // res.status(401).json({ message: "Exista deja un user cu acest email!" });
      return next(error);
    }
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

      db.query(`SELECT id, name, email FROM users WHERE email = '${user.email}'`, (err, result) => {
        if (err) throw err;

        res.status(200).json({ token: token, user: result[0] });

        const message = {
          to: req.body.email,
          from: process.env.EMAIL_USER,
          subject: 'Cont creat cu succes!',
          html: '<h1>Contul tău a fost creat cu succes!</h1><br/><p>Îți multumim pentru că ni te-ai alăturat!<br/>De acum vei fi notificat de cate ori va fi adaugat un articol nou.</p>'
        };

        transport.sendMail(message, (error, info) => {
          if (error) {
            console.log("error sending email", error);
          } else {
            console.log("email sent", info.response);
          }
        });
      });

    });
  });


};

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let foundUser;

  let sql = `SELECT * FROM users WHERE  email = '${email}'`;

  db.query(sql, async (err, result) => {
    if (result.length === 0) {
      const error = new Error("Nu a fost găsit nici un user cu acest email!");
      error.statusCode = 401;
      // res.status(401).json({message: "Nu a fost găsit nici un user cu acest email!"});
      return next(error);
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

    if (isEquel) {
      res.status(200).json({ token: token, user: { id: foundUser.id.toString(), name: foundUser.name, email: foundUser.email, userStatus: foundUser.status } });
    } else {
      res.status(401).json({message: "Parola este greșită!"});
    }
  });
};

exports.getUser = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  if (token !== "null") {
    const decodedToken = jwt.verify(token, 'somesupersecretsecret');

    let sql = `SELECT * FROM users WHERE  email = '${decodedToken.email}'`;
    db.query(sql, (err, result) => {
      const foundUser = result[0];
      res.status(200).json({ token: token, user: { id: foundUser.id.toString(), name: foundUser.name, email: foundUser.email, userStatus: foundUser.status } });
    });
  } else {
    res.json({ message: "ai fost delogat" });
  }
};
