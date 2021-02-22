const mailMan = require("nodemailer");
const {
  MAIL_SERVER,
  INTERNAL_EMAIL_ADDRESS,
  INTERNAL_EMAIL_PASSWORD,
  APP_NAME,
  FROM_EMAIL_ADDRESS,
} = process.env;

module.exports = async function EmailService(options) {
  const transportOptions = {
    host: MAIL_SERVER,
    port: 26,
    secure: false,
    tls: { rejectUnauthorized: false },
    auth: {
      user: INTERNAL_EMAIL_ADDRESS,
      pass: INTERNAL_EMAIL_PASSWORD,
    },
  };

  // console.log(transportOptions);

  const transporter = mailMan.createTransport(transportOptions);
  // console.log(await transporter.verify(), "wait");

  const { from, to, cc, bcc, subject, text, html, attachments } = options;

  const message = {
    from: `${APP_NAME} Team <${FROM_EMAIL_ADDRESS}>`,
    to,
    cc,
    bcc,
    subject,
    text,
    html,
    attachments,
  };
  let info = await transporter.sendMail(message);

  // console.log("email sent");
  // console.log(mailMan.getTestMessageUrl(info));

  return transporter.close();
};
