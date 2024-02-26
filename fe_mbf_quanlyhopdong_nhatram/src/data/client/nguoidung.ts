import { API_ENDPOINTS } from 'src/constants/apiEndpoints';
import { crudFactory } from './curdFactory';

export const nguoiDungClient = {
  ...crudFactory<any, any, any>(API_ENDPOINTS.NGUOI_DUNG),
};
