import { IDmLoaiHDPhuTro, IDmLoaiHDPhuTroInput } from 'src/@types/category';
import { API_ENDPOINTS } from 'src/constants/apiEndpoints';
import { crudFactory } from './curdFactory';

export const dmLoaiHDPhuTroClient = {
  ...crudFactory<IDmLoaiHDPhuTro, any, IDmLoaiHDPhuTroInput>(
    API_ENDPOINTS.DANH_MUC.HOP_DONG_PHU_TRO
  ),
};
