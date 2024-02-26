import { ResponseInfo } from 'src/@types/common';
import { IHopDongImportInput } from 'src/@types/hopdong';
import {
  HopDongXaHoiHoaPaginator,
  HopDongXaHoiHoaQueryOptions,
  IHopDongXaHoiHoa,
  IHopDongXaHoiHoaCreateInput,
  IHopDongXaHoiHoaUpdateInput,
} from 'src/@types/hopdongxahoihoa';
import {
  IExcelBangKeKhaiThanhToan,
  IExcelThanhToanChiHo,
  IThongKeHopDongThanhToan,
  ITransFormDataThanhToan,
} from 'src/@types/thanhtoan';
import { API_ENDPOINTS } from 'src/constants/apiEndpoints';
import { HttpClient } from 'src/utils/httpClient';
import { crudFactory } from './curdFactory';

export const hopDongXaHoiHoaClient = {
  ...crudFactory<IHopDongXaHoiHoa, any, IHopDongXaHoiHoaCreateInput>(API_ENDPOINTS.HOP_DONG),
  createFormData: async (variables: IHopDongXaHoiHoaCreateInput) => {
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
  updateFormData: async (id: number, variables: IHopDongXaHoiHoaUpdateInput) => {
    const formData = new FormData();

    variables.files.forEach((file: File) => {
      formData.append('files', file); // phu luc files
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
    return HttpClient.put<any>(`${API_ENDPOINTS.HOP_DONG}/${id}`, formData, options);
  },
  paginated: ({ search, ...params }: Partial<HopDongXaHoiHoaQueryOptions>) =>
    HttpClient.get<HopDongXaHoiHoaPaginator>(API_ENDPOINTS.HOP_DONG, {
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
};
