import { IDmHinhThucKyHD, IDmHinhThucKyHDInput } from 'src/@types/category';
import { API_ENDPOINTS } from 'src/constants/apiEndpoints';
import { crudFactory } from './curdFactory';

export const dmHinhThucKyHDClient = {
  ...crudFactory<IDmHinhThucKyHD, any, IDmHinhThucKyHDInput>(API_ENDPOINTS.DANH_MUC.HINH_THUC_KY_HD),
};
