import { API_ENDPOINTS } from 'src/constants/apiEndpoints';
import { IDmLoaiThietBiRan, IDmLoaiThietBiRanInput } from 'src/@types/category';
import { crudFactory } from './curdFactory';

export const dmLoaiThietBiRanClient = {
  ...crudFactory<IDmLoaiThietBiRan, any, IDmLoaiThietBiRanInput>(
    API_ENDPOINTS.DANH_MUC.LOAI_THIET_BI_RAN
  ),
};
