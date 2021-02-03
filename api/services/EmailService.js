module.exports = async function EmailService(options) {
  const mailMan = sails.config.globals.nodemailer;

  const transportOptions = {
    host: process.env.MAIL_SERVER,
    port: 26,
    secure: false,
    tls: { rejectUnauthorized: false },
    auth: {
      user: process.env.INTERNAL_EMAIL_ADDRESS,
      pass: process.env.INTERNAL_EMAIL_PASSWORD,
    },
  };

  console.log(transportOptions);

  const transporter = mailMan.createTransport(transportOptions);
  console.log(await transporter.verify(), "wait");

  const { from, to, cc, bcc, subject, text, html, attachments } = options;

  const message = {
    from: `${process.env.APP_NAME} Team <${process.env.FROM_EMAIL_ADDRESS}>`,
    to,
    cc,
    bcc,
    subject,
    text,
    html,
    attachments,
  };
  let info = await transporter.sendMail(message);

  console.log("email sent");
  console.log(mailMan.getTestMessageUrl(info));

  transporter.close();
};
