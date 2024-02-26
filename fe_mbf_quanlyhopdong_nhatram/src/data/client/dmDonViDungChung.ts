import { IDmDonViDungChung, IDmDonViDungChungInput } from 'src/@types/category';
import { API_ENDPOINTS } from 'src/constants/apiEndpoints';
import { crudFactory } from './curdFactory';

export const dmDonViDungChungClient = {
  ...crudFactory<IDmDonViDungChung, any, IDmDonViDungChungInput>(
    API_ENDPOINTS.DANH_MUC.DON_VI_DUNG_CHUNG
  ),
};
