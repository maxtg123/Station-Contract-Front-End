import { IChucVuPhanQuyenInput } from 'src/@types/chucvu';
import { API_ENDPOINTS } from 'src/constants/apiEndpoints';
import { crudFactory } from './curdFactory';

export const chucvuClient = {
  ...crudFactory<any, any, IChucVuPhanQuyenInput>(API_ENDPOINTS.CHUC_VU),
};
