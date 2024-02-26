import { useMutation } from 'react-query';
import { sendMailClient } from './client/sendMail';

export const useSendMailPheDuyetHopDong = () => useMutation(sendMailClient.sendMailPheDuyetHD);

export const useSendMailGiaoViecHopDong = () => useMutation(sendMailClient.sendMailGiaoViecHD);
