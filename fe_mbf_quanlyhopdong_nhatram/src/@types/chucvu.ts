import { OptionType } from './common';

export type IModule =
  | 'NGUOI_DUNG'
  | 'CHUC_VU'
  | 'DANH_MUC'
  | 'TRAM'
  | 'HOP_DONG'
  | 'BAO_CAO'
  | 'DAM_PHAN';

export type IAction =
  | 'XEM'
  | 'THEM_MOI'
  | 'CAP_NHAT'
  | 'IMPORT'
  | 'XET_DUYET'
  | 'GIAO_VIEC'
  | 'NHAN_VIEC';

export type IChucVuPhanQuyenForm = {
  id?: number;
  ten: string;
  phongDai: OptionType | null;
  ghichu: string;
  chucVuPhanQuyenList: { module: IModule; action: IAction }[];
};

export type IPhanQuyen = {
  key: IModule;
  label: string;
  child: { label: string; checked: boolean; key: IAction }[];
};

export type IChucVuPhanQuyenInput = {
  phongDaiId: number;
  ten: string;
  ghichu?: string;
  chucVuPhanQuyenList: { module: IModule; action: IAction }[];
};

export type IChucVuRow = {
  id: number;
  ghichu: string | null;
  ten: string;
  usedStatus: boolean;
  chucVuPhanQuyenList: { action: IAction; module: IModule }[];
  phongDaiId: number;
  dmPhongDai: {
    id: number;
    ghiChu: string | null;
    ma: string;
    ten: string;
  };
  nguoiDungKhuVucList: {
    nguoiDung: {
      email: string;
      gioiTinh: 'NAM' | 'NU';
      hoTen: string;
      id: number;
      soDienThoai: string;
    };
  }[];
  createdAt: string | Date | number;
};
