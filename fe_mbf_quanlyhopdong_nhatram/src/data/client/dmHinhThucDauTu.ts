import { API_ENDPOINTS } from 'src/constants/apiEndpoints';
import { IDmHinhThucDauTu, IDmHinhThucDauTuInput } from 'src/@types/category';
import { crudFactory } from './curdFactory';

export const dmHinhThucDauTuClient = {
  ...crudFactory<IDmHinhThucDauTu, any, IDmHinhThucDauTuInput>(
    API_ENDPOINTS.DANH_MUC.HINH_THUC_DAU_TU
  ),
};
