import { PaginationQueryOptions, PaginatorInfo } from './common';
import { INguoiDung } from './nguoidung';

export type IActionPheDuyet = 'XET_DUYET_TU_CHOI' | 'XET_DUYET_PHE_DUYET' | 'XET_DUYET_GUI_LAI';

export type IActionDamPhan =
  | 'DAM_PHAN_GIAO_VIEC'
  | 'DAM_PHAN_GUI_NOI_DUNG_DAM_PHAN'
  | 'DAM_PHAN_TU_CHOI'
  | 'DAM_PHAN_PHE_DUYET';

export type IThongBao = {
  id: number;
  module: IModule;
  action: IActionPheDuyet | IActionDamPhan;
  content: string;
  trangThai: 'CHUA_XEM' | 'XEM';
  nguoiGui: INguoiDung;
  nguoiNhan: INguoiDung;
  createdAt: Date | number;
  createdBy: string;
};
export interface ThongBaoQueryOptions extends PaginationQueryOptions {
  trangThai?: string;
  module: string;
  action: string;
}
export interface ThongBaoPaginator extends PaginatorInfo<IThongBao> {}

export type IModule = 'HOP_DONG' | 'THANH_TOAN' | 'DAM_PHAN';

export type IThongBaoInPut = {
  id: string;
  trangThai: string;
};
