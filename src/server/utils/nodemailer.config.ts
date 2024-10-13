import nodemailer from "nodemailer";
import { env } from "~/env";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: env.NODEMAILER_EMAIL_USER,
    pass: env.NODEMAILER_EMAIL_PASSWORD,
  },
});

type MailOptions = {
  to: string;
  subject: string;
  html: string;
};
export function sendEmail({ to, subject, html }: MailOptions) {
  return transporter.sendMail({
    from: env.NODEMAILER_EMAIL_USER,
    to,
    subject,
    html,
  });
}
