var Nodemailer = require("nodemailer");

module.exports = {
  emailSend: (data, callBack) => {
    try {
      emailid = process.env.MainEmailid;
      emailpassword = process.env.MainEmailpassword;
      const transporter = Nodemailer.createTransport({
        host: "server.cloudcone.email",
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
          user: emailid,
          pass: emailpassword,
        },
        logger: false,

        tls: {
          ciphers: "SSLv3",
        },
      });

      transporter.verify(function (error, success) {
        if (error) {
          return callBack(err);
        } else {
          let info = transporter.sendMail(
            {
              from: '"Multiverse" <admin@flax.fit>',
              to: "jatindermashall@gmail.com",
              subject: "webhook data recieved from petpooja",
              text: "webhook data recieved from petpooja",
              html: data.html,
            },
            (err, info) => {
              if (err) {
                return callBack(err);
              } else {
              
                return callBack(null, info);
              }
            }
          );
        }
      });
    } catch (error) {
      callBack(error);
    }
  },
  emailSendto: (userDetails, callBack) => {
    try {
      emailid = process.env.MainEmailid;
      //console.log("emailid", emailid);
      emailpassword = process.env.MainEmailpassword;
      const transporter = Nodemailer.createTransport({
        host: "server.cloudcone.email",
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
          user: emailid,
          pass: emailpassword,
        },
        logger: false,

        tls: {
          ciphers: "SSLv3",
        },
      });

      transporter.verify(function (error, success) {
        if (error) {
          return callBack(error);
        } else {
          let info = transporter.sendMail(
            {
              from: '"Flax.Fit" <admin@flax.fit>',
              to: userDetails.email,
              bcc: "barora@flaxfoods.in,nutrition@flaxfoods.in,john@flaxfoods.in",
              subject: userDetails.subject,
              text: userDetails.text,
              html: userDetails.html,
            },
            (err, info) => {
              if (err) {
                return callBack(err);
              } else {
                console.log(info);
                return callBack(null, userDetails.results);
              }
            }
          );
        }
      });
    } catch (error) {
      callBack(error);
    }
  },
  emailSendtospecific: (userDetails, callBack) => {
    try {
      emailid = process.env.MainEmailid;
      //console.log("emailid", emailid);
      emailpassword = process.env.MainEmailpassword;
      const transporter = Nodemailer.createTransport({
        host: "server.cloudcone.email",
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
          user: emailid,
          pass: emailpassword,
        },
        logger: false,

        tls: {
          ciphers: "SSLv3",
        },
      });

      transporter.verify(function (error, success) {
        if (error) {
          return callBack(error);
        } else {
          let info = transporter.sendMail(
            {
              from: '"Flax.Fit" <admin@flax.fit>',
              to: userDetails.to,
              cc: userDetails.cc,
              subject: userDetails.subject,
              text: userDetails.text,
              html: userDetails.html,
            },
            (err, info) => {
              if (err) {
                return callBack(err);
              } else {
                // console.log("sending details")
                // console.log(info)
                return callBack(null, {
                  success: 1,
                  data: "Message sent",
                });
              }
            }
          );
        }
      });
    } catch (error) {
      callBack(error);
    }
  },
};
