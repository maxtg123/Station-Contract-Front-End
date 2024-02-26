import {
  DamPhanListOptionQuery,
  HopDongDamPhanPaginator,
  IDamPhanNoiDungCreateInput,
  IDamPhanNoiDungRequestDto,
  IGiaoViecInput,
  IXetDuyetInput,
} from 'src/@types/damphan';
import { API_ENDPOINTS } from 'src/constants/apiEndpoints';
import { HttpClient } from 'src/utils/httpClient';

export const damPhanHopDongClient = {
  giaoViecDamPhan: (input: IGiaoViecInput) =>
    HttpClient.post<any>(API_ENDPOINTS.DAM_PHAN.GIAO_VIEC, input),
  listDamPhanAndDetail: (options: DamPhanListOptionQuery) => {
    return HttpClient.get<HopDongDamPhanPaginator>(
      `${API_ENDPOINTS.HOP_DONG}/${options.hopDongId}/list-dam-phan`
    );
  },
  guiNoiDungDamPhanFormData: async (variables: IDamPhanNoiDungCreateInput) => {
    const formData = new FormData();
    variables.files.forEach((file: File) => {
      formData.append('files', file);
    });
    formData.append('ghiChu', variables.ghiChu);
    const requestInput: IDamPhanNoiDungRequestDto = {
      ghiChu: variables.ghiChu,
      noiDungThayDoiDamPhanDtos: variables.noiDung,
    };
    formData.append('input', JSON.stringify(requestInput));
    const options = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    const url = `${API_ENDPOINTS.HOP_DONG}/${variables.hopDongId}/${API_ENDPOINTS.DAM_PHAN.index}/${variables.hopDongDamPhanId}`;
    return HttpClient.post<any>(url, formData, options);
  },
  xetDuyet: (input: IXetDuyetInput) =>
    HttpClient.post<any>(
      `${API_ENDPOINTS.HOP_DONG}/${input.hopDongId}/${API_ENDPOINTS.DAM_PHAN.index}/${input.hopDongDamPhanId}/${API_ENDPOINTS.DAM_PHAN.XET_DUYET}/${input.tienTrinhId}`,
      input
    ),
};
