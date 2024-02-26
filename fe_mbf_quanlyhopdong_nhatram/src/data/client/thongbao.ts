import {
  IThongBao,
  IThongBaoInPut,
  ThongBaoPaginator,
  ThongBaoQueryOptions,
} from 'src/@types/thongbao';
import { API_ENDPOINTS } from 'src/constants/apiEndpoints';
import { HttpClient } from 'src/utils/httpClient';
import { crudFactory } from './curdFactory';

export const thongBaoClient = {
  ...crudFactory<IThongBao, any, IThongBaoInPut>(API_ENDPOINTS.THONG_BAO),
  paginated: ({ ...params }: Partial<ThongBaoQueryOptions>) =>
    HttpClient.get<ThongBaoPaginator>(API_ENDPOINTS.THONG_BAO, {
      ...params,
    }),
  totalThongBaoChuaXem: () =>
    HttpClient.get<any>(`${API_ENDPOINTS.THONG_BAO}/number`, {
      trangThai: 'CHUA_XEM',
      page: 1,
      size: 1,
    }),
};
