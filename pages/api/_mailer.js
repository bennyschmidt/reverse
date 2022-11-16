import nodemailer from 'nodemailer';

const {
  MAIL_SERVICE,
  MAIL_HOST,
  MAIL_NAME,
  MAIL_PASS
} = process.env;

const transporter = nodemailer.createTransport({
  service: MAIL_SERVICE,
  host: MAIL_HOST,
  auth: {
    user: MAIL_NAME,
    pass: MAIL_PASS
  }
});

const validateEmailAddress = email => (
  /^[a-z0-9_\-.]{1,64}@[a-z0-9_\-.]{1,64}$/i.test(email)
);

const sendEmailAs = async (from, { to, subject, html }) => (
  transporter.sendMail({
    from,
    to,
    subject,
    html
  })
);

const sendEmail = async ({ to, subject, html }) => (
  sendEmailAs(
    `"Reverse" <${MAIL_NAME}>`,

    {
      to,
      subject,
      html
    }
  )
);

export {
  transporter,
  validateEmailAddress,
  sendEmail
};
