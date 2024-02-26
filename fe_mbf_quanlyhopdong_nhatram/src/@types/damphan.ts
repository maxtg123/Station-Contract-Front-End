import { PaginatorInfo } from './common';
import { IFile } from './file';
import { INguoiDung } from './nguoidung';

export type IXetDuyetInput = {
  hopDongId: number;
  hopDongDamPhanId: number;
  tienTrinhId: number;
  ghiChu: string;
  action: 'tu_choi' | 'phe_duyet';
};
export type IGiaoViecInput = {
  hopDongIdList: number[];
  nguoiDamPhanIdList: number[];
  ghiChu: string;
  mucDoUuTien: IMucDoUuTienDamPhan;
  fromDate: Date;
  toDate: Date;
};

export interface DamPhanListOptionQuery {
  hopDongId: number;
}

export type IHopDongDamPhanStatus = 'GUI_NOI_DUNG_DAM_PHAN' | 'TU_CHOI' | 'PHE_DUYET';

export interface IHopDongTienTrinhChange {
  id: number;
  createdAt: Date | number;
  key: string;
  value: string;
  tramId: number | null;
  ghiChu: string;
}

export interface ITienTrinhXetDuyet {
  id: number;
  createdAt: Date | number;
  ghiChu: string;
  trangThai: Omit<IHopDongDamPhanStatus, 'GUI_NOI_DUNG_DAM_PHAN'>;
  nguoiDung: INguoiDung;
}
export interface IDamPhanFile {
  id: number;
  createdAt: Date | number;
  path: string;
  ten: string;
}

export interface IHopDongDamPhanTienTrinh {
  id: number;
  createdAt: Date | number;
  trangThai: null | IHopDongDamPhanStatus;
  ghiChu: string;
  hopDongDamPhanFiles: IDamPhanFile[] | null;
  hopDongDamPhanTienTrinhChanges: IHopDongTienTrinhChange[] | null;
  hopDongDamPhanTienTrinhXetDuyets: ITienTrinhXetDuyet[] | null;
  nguoiDungId: number;
  nguoiDung: INguoiDung;
}

export type IMucDoUuTienDamPhan = 'LOW' | 'MEDIUM' | 'HEIGHT';
export interface IHopDongDamPhan {
  createdAt: Date | number;
  ghiChu: string;
  hopDongId: number;
  id: number;
  nguoiGui: INguoiDung;
  nguoiGuiId: number;
  trangThaiDamPhanMoiNhat: null | IHopDongDamPhanStatus;
  hopDongDamPhanNguoiNhanList: {
    nguoiDungId: number;
    nguoiDung: INguoiDung;
    hopDongDamPhanId: number;
    id: number;
  }[];
  hopDongDamPhanTienTrinhList: IHopDongDamPhanTienTrinh[];
  mucDoUuTien: null | IMucDoUuTienDamPhan;
  fromDate: Date | number;
  toDate: Date | number;
}

export interface HopDongDamPhanPaginator extends PaginatorInfo<IHopDongDamPhan> {}

export type IChange = { key: string; value: string; tramId: number | null; ghiChu: string };
export type IDamPhamForm = {
  ghiChu: string;
  filesDinhKem: {
    file: File;
  }[];
  changesHopDong: { key: string; value: string; ghiChu: string }[];
  hopDongTrams: { tramId: number; changesTram: { key: string; value: string; ghiChu: string }[] }[];
};

export type IDamPhanNoiDungCreateInput = {
  hopDongDamPhanId: number;
  hopDongId: number;
  files: File[];
  ghiChu: string;
  noiDung: IChange[];
};
export type IDamPhanNoiDungRequestDto = {
  ghiChu: string;
  noiDungThayDoiDamPhanDtos: IChange[];
};

export type IFileDataDamPhan = {
  id: number;
  file?: IFile;
  createdAt: Date | number;
  path: string;
  ten: string;
};
