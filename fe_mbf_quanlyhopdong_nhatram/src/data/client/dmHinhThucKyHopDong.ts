import { IDmHinhThucKyHopDongInput, IDmHinhThucKyHopDong } from 'src/@types/category';
import { API_ENDPOINTS } from 'src/constants/apiEndpoints';
import { crudFactory } from './curdFactory';

export const dmHinhThucKyHopDongClient = {
  ...crudFactory<IDmHinhThucKyHopDong, any, IDmHinhThucKyHopDongInput>(
    API_ENDPOINTS.DANH_MUC.HINH_THUC_KY_HOP_DONG
  ),
};
