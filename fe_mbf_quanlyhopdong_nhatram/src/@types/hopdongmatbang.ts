import {
  IDmDoiTuongKyHopDong,
  IDmHinhThucDauTu,
  IDmHinhThucKyHD,
  IDmHinhThucThanhToan,
  IDmKhoanMuc,
} from './category';
import { PaginationQueryOptions, PaginatorInfo } from './common';
import { IMucDoUuTienDamPhan } from './damphan';
import { IFileData } from './file';
import {
  IHopDongHangMucTramForm,
  IHopDongPheDuyet,
  IHopDongPhuLuc,
  IHopDongTramList,
  ILoaiFileHopDong,
  ILoaiHopDong,
  ITrangThaiHopDong,
  ITrangThaiHopDongQuery,
} from './hopdong';

export type IHopDongDamPhanList = {
  id: number;
  fromDate: Date | number;
  toDate: Date | number;
  ghiChu: string;
  mucDoUuTien: IMucDoUuTienDamPhan;
  trangThaiDamPhanMoiNhat: null | 'TU_CHOI' | 'PHE_DUYET';
};
// IMPORTANT: do not change any key here, it related to log
export type IHopDongForm = {
  id: number | null;
  soHopDong: string;
  soHopDongERP: string;
  hinhThucKy: { id: number; ten: string } | null;
  hinhThucDauTu: { id: number; ten: string } | null;
  doiTuongKy: { id: number; ten: string } | null;
  khoanMuc: { id: number; ten: string } | null;
  ngayKy: Date;
  ngayKetThuc: Date;
  coKyQuy: boolean;
  giaKyQuy: number | null;
  ghiChu: string;
  // Thong tin doi tac
  tenDoiTac: string;
  sdt: string;
  soCMND: string;
  maSoThue: string;
  diaChiLienHe: string;
  // Thong tin thu huong
  chuTaiKhoan: string;
  soTaiKhoan: string;
  nganHangChiNhanh: string;
  // Gia thue
  thueVAT: number | null;
  hinhThucThanhToan: { id: number; ten: string } | null;
  chuKyNam: number;
  chuKyThang: number;
  chuKyNgay: number;
  // remoteFiles: { id: number; loai: string; ten: string; createdAt: Date | number; path: string }[];
  remoteFiles: IFileData[];
  filesDinhKem: {
    file: File;
    status: 'old' | 'new';
    createdAt?: Date;
    id?: number;
    // loai?: string;
    path?: string;
    ten?: string;
  }[];
  filesGiayToSuHuu: {
    file: File;
    status: 'old' | 'new';
    createdAt?: Date;
    id?: number;
    // loai?: string;
    path?: string;
    ten?: string;
  }[];
  filesPhuLuc: {
    file: File;
    status: 'old' | 'new';
    createdAt?: Date;
    id?: number;
    // loai?: string;
    path?: string;
    ten?: string;
  }[];
  hopDongPhuLucModels: IHopDongPhuLuc[];
  ghiChuPhuLuc: string;
  hangMucs: IHopDongHangMucTramForm[];
};

export type IHopDong = {
  id: number;
  chuKyNam: number;
  chuKyNgay: number;
  chuKyThang: number;
  coKyQuy: boolean;
  giaKyQuy: number | null;
  createdAt: Date | number;
  updatedAt: Date | number;
  dmDoiTuongKyHopDong: IDmDoiTuongKyHopDong;
  dmHinhThucDauTu: IDmHinhThucDauTu;
  dmHinhThucKyHopDong: IDmHinhThucKyHD;
  dmHinhThucThanhToan: IDmHinhThucThanhToan;
  dmKhoanMuc: IDmKhoanMuc;
  doiTuongKyId: number;
  hinhThucDauTuId: number;
  hinhThucKyId: number;
  hinhThucThanhToanId: number;
  ghiChu: string;
  hopDongDoiTac: {
    id: number;
    cccd: string;
    chuTaiKhoan: string;
    createdAt: Date | number;
    diaChi: string;
    maSoThue: string;
    nganHangChiNhanh: string;
    soDienThoai: string;
    soTaiKhoan: string;
    ten: string;
  };
  loaiHopDong: ILoaiHopDong;
  ngayKetThuc: Date | number;
  ngayKy: Date | number;
  soHopDong: string;
  soHopDongErp: string;
  thueVat: number;
  trangThaiHopDong: ITrangThaiHopDong;
  hopDongFileModels: {
    id: number;
    hopDongTramId: number | null;
    hopDongPhuLucId: number | null;
    loai: ILoaiFileHopDong;
    ten: string;
    createdAt: Date | number;
    path: string;
  }[];
  hopDongTramList: IHopDongTramList[];
  hopDongDamPhanList: IHopDongDamPhanList[];
  hopDongPhuLucModels: IHopDongPhuLuc[];
  hopDongPheDuyetList: IHopDongPheDuyet[];
};

export type IHopDongCreateInput = {
  files: File[];
  infoFiles: { loaiFile: ILoaiFileHopDong; tramId?: number }[];
  hopDong: {
    soHopDong: string;
    soHopDongErp: string;
    hinhThucKyId: number;
    hinhThucDauTuId: number;
    khoanMucId: number | null;
    doiTuongKyId: number;
    coKyQuy: boolean;
    giaKyQuy: number | null;
    ngayKy: Date;
    ngayKetThuc: Date;
    ghiChu: string;
    thueVat: number;
    hinhThucThanhToanId: number;
    chuKyNam: number;
    chuKyThang: number;
    chuKyNgay: number;
    loaiHopDong: 'MAT_BANG' | 'XA_HOI_HOA';
    hopDongDoiTac: {
      ten: string;
      soDienThoai: string;
      cccd: string;
      maSoThue: string;
      diaChi: string;
      chuTaiKhoan: string;
      soTaiKhoan: string;
      nganHangChiNhanh: string;
    };
    hopDongTramList: {
      tramId: number;
      giaThue: number;
      giaDienKhoan: number | null;
      ngayBatDauYeuCauThanhToan: Date;
      hopDongTramKyThanhToanList: {
        tuNgay: Date;
        denNgay: Date;
        giaTien: number;
        daThanhToanNgay: Date | null;
      }[];
      hopDongTramDungChung: {
        loaiHangMucCSHTId: number | null;
        maTramDonViDungChung: string;
        donViDungChungId: number | null;
        thoiDiemPhatSinh: Date | null;
        ngayLapDatThietBi: Date | null;
        ngayBatDauDungChung: Date | null;
        ngayKetThucDungChung: Date | null;
      } | null;
      hopDongTramPhuTroList: { gia: number; hienThiThongTinChiTiet: boolean; dmPhuTroId: number }[];
    }[];
    hopDongPhuLucModels: { ghiChu: string }[] | null;
    hopDongFileModels: { id: number; loai: string }[] | null; // contain file ids that do not update/remove/insert
  };
};
export type IHopDongUpdateInput = IHopDongCreateInput & {
  changeLog?: string | null;
};

export interface HopDongQueryOptions extends PaginationQueryOptions {
  loaiHopDong: ILoaiHopDong;
  trangThaiThanhToan: string;
  tinhTrangThanhToan: string | null;
  search: string;
  trangThaiHopDong?: ITrangThaiHopDongQuery;
  responseType?: number; // 0: get all, 1: pagination, default is 1
  countOnly?: number; // 0: false, 1 true
}
export interface HopDongPaginator extends PaginatorInfo<IHopDong> {}

export type IDataHopDongPhuLuc = {
  file: IFileData[];
  phuLuc: IHopDongPhuLuc;
};

export type ICreatePheDuyetHopDongInput = {
  hopDongIdList: number[];
  nguoiPheDuyetIdList: number[];
  ghiChu: string;
};

export type ILogPheDuyetVersion = '0.0.0' | '0.0.1';
export type ITrangThaiPheDuyet = 'PHE_DUYET' | 'TU_CHOI' | 'GUI_LAI' | 'UPDATE_HOP_DONG';
export type IPheDuyetHopDongInput = {
  hopDongId: number;
  hopDongPheDuyetId: number;
  ghiChu: string;
  trangThaiPheDuyet: ITrangThaiPheDuyet;
  changeLog?: string; // json array
};

// export interface HopDongPheDuyetOptions extends PaginationQueryOptions {
//   trangThaiPheDuyet?: IHopDongPheDuyetStatus;
//   hopDong?: number;
// }

// export interface IHopDongPheDuyet {
//   id: number;
//   groupIdByTimestamp: string;
//   ghiChu: string | null;
//   lyDo: string | null;
//   createdAt: Date;
//   trangThaiPheDuyet: IHopDongPheDuyetStatus;
//   nguoiGui: INguoiDung;
//   nguoiDuyet: INguoiDung | null;
//   nguoiNhanList:
//     | {
//         nguoiDung: INguoiDung;
//         trangThai: 'PENDING';
//       }[]
//     | null;
//   changeLog: string;
// }

// export interface HopDongPheDuyetPaginator extends PaginatorInfo<IHopDongPheDuyet> {}

/** */
