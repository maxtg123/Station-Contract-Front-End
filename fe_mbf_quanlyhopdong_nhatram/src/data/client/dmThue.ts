import { IDmThue, IDmThueInput } from 'src/@types/category';
import { API_ENDPOINTS } from 'src/constants/apiEndpoints';
import { crudFactory } from './curdFactory';

export const dmThueClient = {
  ...crudFactory<IDmThue, any, IDmThueInput>(API_ENDPOINTS.DANH_MUC.THUE),
};
