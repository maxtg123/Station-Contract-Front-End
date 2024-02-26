import { HopDongLichSuPaginator, HopDongLichSuQueryOptions } from 'src/@types/hopDongLichSu';
import { API_ENDPOINTS } from 'src/constants/apiEndpoints';
import { HttpClient } from 'src/utils/httpClient';

export const hopDongLichSuClient = {
  paginated: ({ ...params }: Partial<HopDongLichSuQueryOptions>) =>
    HttpClient.get<HopDongLichSuPaginator>(API_ENDPOINTS.HOP_DONG_LICH_SU, {
      ...params,
    }),
};
