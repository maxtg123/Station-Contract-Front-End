import { IDmTo, IDmToInput } from 'src/@types/category';
import { API_ENDPOINTS } from 'src/constants/apiEndpoints';
import { crudFactory } from './curdFactory';

export const dmToClient = {
  ...crudFactory<IDmTo, any, IDmToInput>(API_ENDPOINTS.DANH_MUC.TO),
};
