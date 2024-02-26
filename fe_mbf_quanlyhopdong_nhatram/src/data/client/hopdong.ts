import { ResponseInfo } from 'src/@types/common';
import { IOldFilesHopDong } from 'src/@types/hopdong';
import { API_ENDPOINTS, API_ENDPOINTS_NEXT } from 'src/constants/apiEndpoints';
import { HttpClient } from 'src/utils/httpClient';

export const hopDongClient = {
  getPhuLucFromWebCu: () =>
    HttpClient.post<any>(
      API_ENDPOINTS_NEXT.HOP_DONG_CHUONG_TRINH_CU.GET_PHU_LUC_HOP_DONG_CHUONG_TRINH_CU,
      null
    ),
  getHopDongThuHuongFromWebCu: () =>
    HttpClient.post<any>(
      API_ENDPOINTS_NEXT.HOP_DONG_CHUONG_TRINH_CU.GET_HOP_DONG_THU_HUONG_CHUONG_TRINH_CU,
      null
    ),
  getOldFiles: (input: { soHopDong: string }) =>
    HttpClient.get<ResponseInfo<IOldFilesHopDong>>(API_ENDPOINTS.HOP_DONG_OLD_FILES, input),
};
