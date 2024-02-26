import { API_ENDPOINTS } from 'src/constants/apiEndpoints';
import { IDmLoaiTram, IDmLoaiTramInput } from 'src/@types/category';
import { crudFactory } from './curdFactory';

export const dmLoaiTramClient = {
  ...crudFactory<IDmLoaiTram, any, IDmLoaiTramInput>(API_ENDPOINTS.DANH_MUC.LOAI_TRAM),
};
