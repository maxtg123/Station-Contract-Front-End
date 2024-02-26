import { ResponseInfo } from 'src/@types/common';
import { API_ENDPOINTS } from 'src/constants/apiEndpoints';
import { HttpClient } from 'src/utils/httpClient';

export const tienTrinhClient = {
  tienTrinh: async (id: number) =>
    HttpClient.get<ResponseInfo<any>>(`${API_ENDPOINTS.TIEN_TRINH}/${id}`),
  deleteTienTrinh: async (id: number) =>
    HttpClient.delete<ResponseInfo<any>>(`${API_ENDPOINTS.TIEN_TRINH}/${id}`),
};
