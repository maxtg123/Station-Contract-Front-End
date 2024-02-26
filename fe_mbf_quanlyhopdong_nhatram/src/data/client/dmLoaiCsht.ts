import { IDmLoaiCsht, IDmLoaiCshtInput } from 'src/@types/category';
import { API_ENDPOINTS } from 'src/constants/apiEndpoints';
import { crudFactory } from './curdFactory';

export const dmLoaiCshtClient = {
  ...crudFactory<IDmLoaiCsht, any, IDmLoaiCshtInput>(API_ENDPOINTS.DANH_MUC.LOAI_CSHT),
};
