import { IDmLoaiPhongMayPhatDien, IDmLoaiPhongMayPhatDienInput } from 'src/@types/category';
import { API_ENDPOINTS } from 'src/constants/apiEndpoints';
import { crudFactory } from './curdFactory';

export const dmdmLoaiPhongMayPhatDienClient = {
  ...crudFactory<IDmLoaiPhongMayPhatDien, any, IDmLoaiPhongMayPhatDienInput>(
    API_ENDPOINTS.DANH_MUC.LOAI_PHONG_MAY_PHAT_DIEN
  ),
};
