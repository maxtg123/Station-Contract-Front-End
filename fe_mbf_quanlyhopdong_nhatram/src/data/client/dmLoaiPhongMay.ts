import { IDmLoaiPhongMay, IDmLoaiPhongMayInput } from 'src/@types/category';
import { API_ENDPOINTS } from 'src/constants/apiEndpoints';
import { crudFactory } from './curdFactory';

export const dmLoaiPhongMayClient = {
  ...crudFactory<IDmLoaiPhongMay, any, IDmLoaiPhongMayInput>(API_ENDPOINTS.DANH_MUC.LOAI_PHONG_MAY),
};
