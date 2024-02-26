import { IDmKhoanMuc, IDmKhoanMucInput } from 'src/@types/category';
import { API_ENDPOINTS } from 'src/constants/apiEndpoints';
import { crudFactory } from './curdFactory';

export const dmKhoanMucClient = {
  ...crudFactory<IDmKhoanMuc, any, IDmKhoanMucInput>(
    API_ENDPOINTS.DANH_MUC.KHOAN_MUC
  ),
};
