/* eslint-disable func-names */
/* eslint-disable consistent-return */
import type { NextApiRequest, NextApiResponse } from 'next';
import { ISendMailGiaoViec } from 'src/@types/sendmail';
import { createTransporter } from 'src/configs/email-config';

interface ExtendedNextApiRequest extends NextApiRequest {
  body: ISendMailGiaoViec;
}

export default async function handler(
  _req: ExtendedNextApiRequest,
  res: NextApiResponse<{ message: string }>
) {
  try {
    // Read the email template file
    // const emailTemplatePath = path.join(process.cwd(), 'public/templates/mails/mail_phe_duyet.html');
    // mail online: https://dashboard.unlayer.com/create/food-items-delivery-notification
    const transporter = createTransporter();
    const mailOptions = {
      from: 'your-email@outlook.com',
      to: 'recipient@example.com',
      subject: 'Test Email',
      text: 'Hello, this is a test email.',
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });
    res.status(200).json({ message: 'Emails sent successfully' });
  } catch (error) {
    console.error('Error sending email', error);
    res.status(500).json({ message: 'Error sending email' });
  }
}
