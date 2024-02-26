import { IDmXa, IDmXaInput } from 'src/@types/category';
import { API_ENDPOINTS } from 'src/constants/apiEndpoints';
import { crudFactory } from './curdFactory';

export const dmXaClient = {
  ...crudFactory<IDmXa, any, IDmXaInput>(API_ENDPOINTS.DANH_MUC.XA),
};
