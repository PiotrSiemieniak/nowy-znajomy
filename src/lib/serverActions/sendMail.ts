import nodemailer from 'nodemailer';

export type SendMailOptions = {
  to: string;
  subject: string;
  html: string;
};

/**
 * Wysyła maila z podanym szablonem HTML, tytułem i adresatem.
 */
export async function sendMail({ to, subject, html }: SendMailOptions) {
  // Ustaw dane SMTP (możesz użyć np. Gmail, Mailtrap, lub SMTP od hostingu)
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false, // true dla 465, false dla innych portów
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject,
    html,
  });
}
