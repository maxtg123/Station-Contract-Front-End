import { IDmLoaiHangMucCsht, IDmLoaiHangMucCshtInput } from 'src/@types/category';
import { API_ENDPOINTS } from 'src/constants/apiEndpoints';
import { crudFactory } from './curdFactory';

export const dmLoaiHangMucCshtClient = {
  ...crudFactory<IDmLoaiHangMucCsht, any, IDmLoaiHangMucCshtInput>(
    API_ENDPOINTS.DANH_MUC.LOAI_HANG_MUC_CSHT
  ),
};
