import {
  IDmDoiTuongKyHopDong,
  IDmHinhThucDauTu,
  IDmHinhThucKyHD,
  IDmHinhThucThanhToan,
} from './category';
import { PaginationQueryOptions, PaginatorInfo } from './common';
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
import { INguoiDung } from './nguoidung';

// IMPORTANT: do not change any key here, it related to log
export type IHopDongXaHoiHoaForm = {
  id: number | null;
  soHopDong: string;
  soHopDongERP: string;
  hinhThucKyId: number | '';
  hinhThucDauTuId: number | '';
  doiTuongKyId: number | '';
  ngayKy: Date;
  ngayKetThuc: Date;
  coKyQuy: boolean;
  giaKyQuy: number;
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
  hinhThucThanhToanId: number | '';
  chuKyNam: number;
  chuKyThang: number;
  chuKyNgay: number;
  remoteFiles: { id: number; loai: string; ten: string; createdAt: Date | number; path: string }[];
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
  hopDongPhuLucList: IHopDongPhuLuc[];
  ghiChuPhuLuc: string;
  hangMucs: IHopDongHangMucTramForm[];
};

export type IHopDongXaHoiHoa = {
  id: number;
  chuKyNam: number;
  chuKyNgay: number;
  chuKyThang: number;
  coKyQuy: boolean;
  giaKyQuy: number;
  createdAt: Date | number;
  dmDoiTuongKyHopDong: IDmDoiTuongKyHopDong;
  dmHinhThucDauTu: IDmHinhThucDauTu;
  dmHinhThucKyHopDong: IDmHinhThucKyHD;
  dmHinhThucThanhToan: IDmHinhThucThanhToan;
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

  // hopDongPhuLucList: IHopDongPhuLuc[];
  hopDongPheDuyetList: IHopDongPheDuyet[];
};

export type IHopDongXaHoiHoaCreateInput = {
  files: File[];
  infoFiles: { loai: ILoaiFileHopDong }[];
  hopDong: {
    tramId: number;
    soHopDong: string;
    soHopDongErp: string;
    hinhThucKyId: number;
    hinhThucDauTuId: number;
    doiTuongKyId: number;
    coKyQuy: boolean;
    giaKyQuy: number;
    ngayKy: Date;
    ngayKetThuc: Date;
    ghiChu: string;
    giaThue: number;
    giaDienKhoan: number | null;
    thueVat: number;
    hinhThucThanhToanId: number;
    chuKyNam: number;
    chuKyThang: number;
    chuKyNgay: number;
    ngayBatDauYeuCauThanhToan: Date;
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
    hopDongPhuTroList: { gia: number; hienThiThongTinChiTiet: boolean; dmPhuTroId: number }[];
    hopDongKyThanhToanList: { tuNgay: Date; denNgay: Date; tien: number }[];
    hopDongPhuLucList: { ghiChu: string }[] | null;
    fileList: { id: number; loai: string }[] | null; // contain file ids that do not update/remove/insert
    hopDongDungChung: {
      loaiHangMucCSHTId: number | null;
      maTramDonViDungChung: string;
      donViDungChung: string;
      thoiDiemPhatSinh: Date | null;
      ngayLapDatThietBi: Date | null;
      ngayBatDauDungChung: Date | null;
      ngayKetThucDungChung: Date | null;
    } | null;
  };
};
export type IHopDongXaHoiHoaUpdateInput = IHopDongXaHoiHoaCreateInput & {
  // filesPhuLuc: File[];
};

export interface HopDongXaHoiHoaQueryOptions extends PaginationQueryOptions {
  loaiHopDong: ILoaiHopDong;
  trangThaiThanhToan: string;
  search: string;
  trangThaiHopDong?: ITrangThaiHopDongQuery;
  responseType?: number; // 0: get all, 1: pagination, default is 1
  countOnly?: number; // 0: false, 1 true
}
export interface HopDongXaHoiHoaPaginator extends PaginatorInfo<IHopDongXaHoiHoa> {}

export type IDataHopDongPhuLuc = {
  file: IFileData[];
  phuLuc: IHopDongPhuLuc;
};

export type IHopDongPheDuyetStatus = 'CHO_PHE_DUYET' | 'PHE_DUYET' | 'TU_CHOI' | 'GUI_LAI';

export type ICreatePheDuyetHopDongInput = {
  hopDongIdList: number[];
  nguoiPheDuyetIdList: number[];
  ghiChu: string;
};

export type IPheDuyetHopDongInput = {
  hopDongId: number;
  ghiChu: string;
  trangThaiPheDuyet: 'PHE_DUYET' | 'TU_CHOI' | 'GUI_LAI';
  changeLog: string; // json array
  xetDuyetAction: 'XET_DUYET_HOP_DONG' | 'XET_DUYET_PHU_LUC';
  groupIdByTimestamp: string;
};

export interface HopDongPheDuyetOptions extends PaginationQueryOptions {
  trangThaiPheDuyet?: IHopDongPheDuyetStatus;
  hopDong?: number;
}

export interface IHopDongXaHoiHoaPheDuyet {
  id: number;
  groupIdByTimestamp: string;
  ghiChu: string | null;
  lyDo: string | null;
  createdAt: Date;
  trangThaiPheDuyet: IHopDongPheDuyetStatus;
  nguoiGui: INguoiDung;
  nguoiDuyet: INguoiDung | null;
  nguoiNhanList:
    | {
        nguoiDung: INguoiDung;
        trangThai: 'PENDING';
      }[]
    | null;
  changeLog: string;
}

export interface HopDongPheDuyetPaginator extends PaginatorInfo<IHopDongXaHoiHoaPheDuyet> {}
