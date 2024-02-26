import { AxiosRequestConfig } from 'axios';
import { ResponseInfo } from 'src/@types/common';
import { IExportHopDong, IHopDongImportInput } from 'src/@types/hopdong';
import {
  HopDongPaginator,
  HopDongQueryOptions,
  IHopDong,
  IHopDongCreateInput,
  IHopDongUpdateInput,
} from 'src/@types/hopdongmatbang';
import {
  IExcelBangKeKhaiThanhToan,
  IExcelThanhToanChiHo,
  IThongKeHopDongThanhToan,
  ITransFormDataThanhToan,
} from 'src/@types/thanhtoan';
import { API_ENDPOINTS } from 'src/constants/apiEndpoints';
import { HttpClient } from 'src/utils/httpClient';
import { crudFactory } from './curdFactory';

export const hopDongClient = {
  ...crudFactory<IHopDong, any, IHopDongCreateInput>(API_ENDPOINTS.HOP_DONG),
  createFormData: async (variables: IHopDongCreateInput) => {
    const formData = new FormData();

    variables.files.forEach((file: File) => {
      formData.append('files', file);
    });

    if (variables.infoFiles.length > 0) {
      formData.append(`infoFiles`, JSON.stringify(variables.infoFiles.map((info) => info)));
    }
    formData.append('hopDong', JSON.stringify(variables.hopDong));
    const options = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    return HttpClient.post<any>(API_ENDPOINTS.HOP_DONG, formData, options);
  },
  updateFormData: async (id: number, variables: IHopDongUpdateInput) => {
    const formData = new FormData();

    variables.files.forEach((file: File) => {
      formData.append('files', file); // phu luc files
    });
    if (variables.infoFiles.length > 0) {
      formData.append(`infoFiles`, JSON.stringify(variables.infoFiles.map((info) => info)));
    }
    formData.append('hopDong', JSON.stringify(variables.hopDong));
    if (variables?.changeLog) {
      formData.append('changeLog', variables.changeLog);
    }
    const options = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    return HttpClient.put<any>(`${API_ENDPOINTS.HOP_DONG}/${id}`, formData, options);
  },
  paginated: ({ search, ...params }: Partial<HopDongQueryOptions>) =>
    HttpClient.get<HopDongPaginator>(API_ENDPOINTS.HOP_DONG, {
      ...params,
      search,
    }),
  updateThanhToanHopDong: (data: ITransFormDataThanhToan[]) =>
    HttpClient.put<ResponseInfo<any>>(API_ENDPOINTS.THANH_TOAN_HOP_DONG, data),
  thongKeHopDongThanhToan: (endpoint: string) => HttpClient.get<IThongKeHopDongThanhToan>(endpoint),
  export: (data: IExcelThanhToanChiHo) =>
    HttpClient.fullPost<any>(`${API_ENDPOINTS.HOP_DONG}/export/de-nghi-chi-ho`, data, {
      responseType: 'blob',
    }),
  exportBangKeKhaiThanhToan: (data: IExcelBangKeKhaiThanhToan) =>
    HttpClient.fullPost<any>(`${API_ENDPOINTS.HOP_DONG}/export/bang-ke-khai-thanh-toan`, data, {
      responseType: 'blob',
    }),
  import: async (data: IHopDongImportInput[]) =>
    HttpClient.fullPost<any>(`${API_ENDPOINTS.HOP_DONG}/import`, data),
  deleteHopDongNhap: (id: string) =>
    HttpClient.delete<ResponseInfo<any>>(`${API_ENDPOINTS.HOP_DONG}/delete-type-nhap/${id}`),
  exportExcelHopDong: (endpoint: string, data: IExportHopDong) => {
    const { listId, listKey, excludeKey, ...lastData } = data;
    const newPayload = {
      listId: listId.join(','),
      listKey,
      excludeKey,
    };
    const config: AxiosRequestConfig = {
      timeout: 0, // Thiết lập thời gian timeout riêng (15 giây)
      params: { ...lastData },
      responseType: 'blob',
    };
    return HttpClient.fullPost<any>(`${endpoint}/export`, newPayload, config);
  },
};
