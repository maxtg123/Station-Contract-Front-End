import { API_ENDPOINTS } from 'src/constants/apiEndpoints';
import { IDmPhongDai, IDmPhongDaiInput } from 'src/@types/category';
import { crudFactory } from './curdFactory';

export const dmPhongDaiClient = {
  ...crudFactory<IDmPhongDai, any, IDmPhongDaiInput>(API_ENDPOINTS.DANH_MUC.PHONG_DAI),
};
