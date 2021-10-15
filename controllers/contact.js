const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
    service: 'yahoo',
    auth: {
        user: 'andrei.pirea@yahoo.ro',
        pass: 'ckmkwwudkegielti'
    }
});

exports.getContact = (req, res, next) => {
    const message = {
        to: 'andrei.pirea@yahoo.ro',
        from: 'andrei.pirea@yahoo.ro',
        subject: 'Contact manuteharnicute.ro',
        html: `<h1>Nume: ${req.body.name}<br/>E-mail: ${req.body.email}</h1><br/><br/><p>${req.body.message}</p>`
    };

    transport.sendMail(message, (error, info) => {
        if (error) {
            console.log("error sending email", error);
            res.status(500).json({ message: "error" });
        } else {
            console.log("email sent", info.response);
            res.status(200).json({ message: "success" });
        }
    });

    // res.status(500).json({ message: "error" });
    // res.status(200).json({ message: "success" });



};