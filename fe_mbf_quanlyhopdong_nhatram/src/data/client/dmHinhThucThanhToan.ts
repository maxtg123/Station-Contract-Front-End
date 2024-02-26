import { IDmHinhThucThanhToan, IDmHinhThucThanhToanInput } from 'src/@types/category';
import { API_ENDPOINTS } from 'src/constants/apiEndpoints';
import { crudFactory } from './curdFactory';

export const dmHinhThucThanhToanClient = {
  ...crudFactory<IDmHinhThucThanhToan, any, IDmHinhThucThanhToanInput>(
    API_ENDPOINTS.DANH_MUC.HINH_THUC_THANH_TOAN
  ),
};
