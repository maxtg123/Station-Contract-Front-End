import { IDmHuyen, IDmHuyenInput } from 'src/@types/category';
import { API_ENDPOINTS } from 'src/constants/apiEndpoints';
import { crudFactory } from './curdFactory';

export const dmHuyenClient = {
  ...crudFactory<IDmHuyen, any, IDmHuyenInput>(API_ENDPOINTS.DANH_MUC.HUYEN),
};
