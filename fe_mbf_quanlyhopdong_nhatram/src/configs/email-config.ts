import nodemailer from 'nodemailer';

// Hàm khởi tạo transporter dùng để gửi email
export function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.MAIL_HOST?.toString() || 'email.mobifone.vn',
    port: 587,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
  });
}

// export function createMobiTransporter() {
//   return nodemailer.createTransport({
//     host: 'email.mobifone.vn',
//     port: 587,
//     secure: false,
//     requireTLS: true,
//     auth: {
//       user: process.env.SMTP_USERNAME,
//       pass: process.env.SMTP_PASSWORD,
//     },
//   });
// }

export const mailOptions = (email: string, subject: string, html: string) => ({
  from: process.env.SMTP_USERNAME,
  to: email,
  subject,
  html,
});
