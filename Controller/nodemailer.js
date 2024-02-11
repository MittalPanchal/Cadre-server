var nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "bhavik2991@gmail.com",
    pass: "berkfnagseunbtac",
  },
});
const nodemail = async (req, res) => {
  console.log(req.body);
  var mailOptions = {
    from: "bhavik2991@gmail.com",
    to: req.body.name,
    subject: req.body.subject,
    text: req.body.message,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      return res.json({ success: true, msg: "sent" });
      //console.log('Email sent: ' + info.response);
    }
  });
};
module.exports = nodemail;