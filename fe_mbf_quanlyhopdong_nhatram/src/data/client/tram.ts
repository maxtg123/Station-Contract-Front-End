import { IHopDong } from 'src/@types/hopdongmatbang';
import {
  IDataExportTram,
  IThongKeTram,
  ITramInput,
  TramPaginator,
  TramQueryOptions,
} from 'src/@types/tram';
import { API_ENDPOINTS } from 'src/constants/apiEndpoints';
import { HttpClient } from 'src/utils/httpClient';
import { crudFactory } from './curdFactory';

export const tramClient = {
  ...crudFactory<any, any, ITramInput>(API_ENDPOINTS.TRAM),
  paginated: ({ search, ...params }: Partial<TramQueryOptions>) =>
    HttpClient.get<TramPaginator>(API_ENDPOINTS.TRAM, {
      ...params,
      search,
    }),
  thongKeTram: (endpoint: string) => HttpClient.get<IThongKeTram>(endpoint),
  exportExcelTram: (endpoint: string, data: IDataExportTram) => {
    const { listId, ...lastData } = data;
    return HttpClient.fullPost<any>(`${endpoint}/export`, listId, {
      params: { ...lastData },
      responseType: 'blob',
    });
  },
  syncTramFromPTM: async () => HttpClient.fullPost<number>(`${API_ENDPOINTS.TRAM}/syncFromPTM`, {}),
  getListHopDongOfTram: (tramId: number) =>
    HttpClient.get<IHopDong[]>(`${API_ENDPOINTS.TRAM}/hop-dong-by-tram-id`, {
      tramId,
    }),
};
