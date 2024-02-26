import { ISendMailGiaoViec, ISendMailPheDuyet } from 'src/@types/sendmail';
import { API_ENDPOINTS_NEXT } from 'src/constants/apiEndpoints';
import { HttpClientNext } from 'src/utils/httpClientNext';

export const sendMailClient = {
  sendMailPheDuyetHD: (input: ISendMailPheDuyet) =>
    HttpClientNext.post<any>(API_ENDPOINTS_NEXT.HOP_DONG.SEND_MAIL_PHE_DUYET, input),
  sendMailGiaoViecHD: (input: ISendMailGiaoViec) =>
    HttpClientNext.post<any>(API_ENDPOINTS_NEXT.HOP_DONG.SEND_MAIL_GIAO_VIEC, input),
};
