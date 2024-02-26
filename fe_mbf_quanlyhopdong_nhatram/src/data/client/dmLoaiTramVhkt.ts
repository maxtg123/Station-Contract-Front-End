import { IDmLoaiLoaiTramVhktInput, IDmLoaiTramVhkt } from 'src/@types/category';
import { API_ENDPOINTS } from 'src/constants/apiEndpoints';
import { crudFactory } from './curdFactory';

export const dmLoaiTramVhktClient = {
  ...crudFactory<IDmLoaiTramVhkt, any, IDmLoaiLoaiTramVhktInput>(
    API_ENDPOINTS.DANH_MUC.LOAI_TRAM_VHKT
  ),
};
