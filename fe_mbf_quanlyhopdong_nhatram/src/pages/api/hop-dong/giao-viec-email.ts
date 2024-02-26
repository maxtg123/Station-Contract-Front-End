/* eslint-disable func-names */
/* eslint-disable consistent-return */
import fs from 'fs';
import handlebars from 'handlebars';
import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import { ISendMailGiaoViec } from 'src/@types/sendmail';
import { createTransporter, mailOptions } from 'src/configs/email-config';
import { getEmailDataForRecipient } from 'src/utils/emailUtils';

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
    const mailTemplatePath = path.join(process.cwd(), 'public/templates/mails/mail_phe_duyet.html');
    const mailContent = fs.readFileSync(mailTemplatePath, 'utf-8');

    const recipients = _req.body.nguoiNhanViec;
    const sender = _req.body.nguoiGiaoViec;
    const { type } = _req.body;
    const { listHopDong } = _req.body;
    const checkListHopDong = listHopDong.length > 10 ? listHopDong.slice(0, 10) : listHopDong;
    const isMoreListTen = listHopDong.length > 10;
    const countListHopDong = listHopDong.length - 10;
    const isGiaoViec = true;
    const urlRedirect = `${process.env.HOSTTING_REDIRECT_ENDPOINT}/${type}/giao-viec`;
    handlebars.registerHelper('if', function (this: any, conditional, options) {
      if (conditional) {
        return options.fn(this);
      }
    });
    const template = handlebars.compile(mailContent);
    const heading = 'Danh sách hợp đồng cần đàm phán';
    const title = 'cần đàm phán từ';
    const mailPromises = recipients.map(async (recipient) => {
      const { email } = recipient;
      const { receiver } = getEmailDataForRecipient(recipient);
      const html = template({
        heading,
        title,
        receiver,
        sender,
        checkListHopDong,
        isMoreListTen,
        countListHopDong,
        listHopDong,
        urlRedirect,
        isGiaoViec,
      });
      const dataEmail = mailOptions(email, heading, html);
      await transporter.sendMail(dataEmail);
    });
    await Promise.all(mailPromises);
    res.status(200).json({ message: 'Emails sent successfully' });
  } catch (error) {
    console.error('Error sending email', error);
    res.status(500).json({ message: 'Error sending email' });
  }
}
