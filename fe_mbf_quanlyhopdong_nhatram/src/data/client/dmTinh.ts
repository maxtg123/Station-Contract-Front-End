import { IDmTinh, IDmTinhInput } from 'src/@types/category';
import { API_ENDPOINTS } from 'src/constants/apiEndpoints';
import { crudFactory } from './curdFactory';

export const dmTinhClient = {
  ...crudFactory<IDmTinh, any, IDmTinhInput>(API_ENDPOINTS.DANH_MUC.TINH),
};
