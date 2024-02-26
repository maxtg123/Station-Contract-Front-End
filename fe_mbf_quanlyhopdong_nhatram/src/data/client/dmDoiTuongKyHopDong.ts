import { API_ENDPOINTS } from 'src/constants/apiEndpoints';
import { IDmDoiTuongKyHopDong, IDmDoiTuongKyHopDongInput } from 'src/@types/category';
import { crudFactory } from './curdFactory';

export const dmDoiTuongKyHopDongClient = {
  ...crudFactory<IDmDoiTuongKyHopDong, any, IDmDoiTuongKyHopDongInput>(
    API_ENDPOINTS.DANH_MUC.DOI_TUONG_KY_HOP_DONG
  ),
};
