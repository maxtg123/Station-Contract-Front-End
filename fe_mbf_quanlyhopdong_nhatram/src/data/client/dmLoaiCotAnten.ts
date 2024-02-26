import { API_ENDPOINTS } from 'src/constants/apiEndpoints';
import { IDmLoaiCotAnten, IDmLoaiCotAntenInput } from 'src/@types/category';
import { crudFactory } from './curdFactory';

export const dmLoaiCotAntenClient = {
  ...crudFactory<IDmLoaiCotAnten, any, IDmLoaiCotAntenInput>(API_ENDPOINTS.DANH_MUC.LOAI_COT_ANTEN),
};
