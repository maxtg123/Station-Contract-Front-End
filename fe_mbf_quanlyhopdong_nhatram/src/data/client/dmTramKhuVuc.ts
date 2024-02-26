import { API_ENDPOINTS } from 'src/constants/apiEndpoints';
import { IDmTramKhuVuc, IDmTramKhuVucInput } from 'src/@types/category';
import { crudFactory } from './curdFactory';

export const dmTramKhuVucClient = {
  ...crudFactory<IDmTramKhuVuc, any, IDmTramKhuVucInput>(API_ENDPOINTS.DANH_MUC.TRAM_KHU_VUC),
};
