import {
  IDmDoiTuongKyHopDong,
  IDmDonViDungChung,
  IDmHinhThucDauTu,
  IDmHinhThucKyHopDong,
  IDmHinhThucThanhToan,
  IDmHuyen,
  IDmKhoanMuc,
  IDmLoaiCotAnten,
  IDmLoaiCsht,
  IDmLoaiHDPhuTro,
  IDmLoaiHangMucCsht,
  IDmLoaiPhongMay,
  IDmLoaiPhongMayPhatDien,
  IDmLoaiThietBiRan,
  IDmLoaiTram,
  IDmLoaiTramVhkt,
  IDmThue,
  IDmTinh,
  IDmTo,
  IDmTramKhuVuc,
  IDmXa,
} from './category';
import { OptionTypeTram, PaginatorInfo } from './common';
import { INguoiDung } from './nguoidung';
import { ITram } from './tram';

export type ILoaiHopDong = 'MAT_BANG' | 'XA_HOI_HOA' | 'IBC';

export type ITrangThaiHopDong =
  | 'NHAP'
  | 'CHO_PHE_DUYET_HOP_DONG'
  | 'CHO_PHE_DUYET_PHU_LUC'
  | 'CAN_PHE_DUYET'
  | 'HOAT_DONG'
  | 'NGUNG_HOAT_DONG';

export type ITrangThaiHopDongQuery =
  | 'NHAP'
  | 'CHO_PHE_DUYET'
  | 'CAN_PHE_DUYET'
  | 'HOAT_DONG'
  | 'SAP_HET_HAN'
  | 'DA_GIAO_VIEC'
  | 'VIEC_CAN_LAM';

export type ILoaiFileHopDong =
  | 'FILE_HOP_DONG'
  | 'FILE_GIAY_TO_SO_HUU'
  | 'FILE_PHU_LUC'
  | 'FILE_DUNG_CHUNG';

export type IHopDongKyThanhToan = {
  id: number;
  tuNgay: Date | number;
  denNgay: Date | number;
  giaTien: number;
  soTienThanhToan: number;
  thanhToanBy: string;
  thanhToanNgay: Date | number;
  daThanhToanNgay: Date | number;
  nguoiThanhToan: {
    hoTen: string;
    createdAt: Date | null;
    updatedAt: Date | null;
    email: string;
  };
};

export type IHopDongTramList = {
  id: number;
  createdAt: Date | number;
  giaDienKhoan: number;
  giaThue: number;
  ngayBatDauYeuCauThanhToan: Date | number;
  tramId: number;
  tram: ITram;
  trangThaiHoatDong: 'NGUNG_HOAT_DONG' | 'HOAT_DONG';
  hopDongTramDungChung: {
    id: number;
    createdAt: Date | number;
    dmLoaiHangMucCSHT: IDmLoaiHangMucCsht | null;
    loaiHangMucCSHTId: number | null;
    dmDonViDungChung: IDmDonViDungChung | null;
    hopDongTramId: number;
    maTramDonViDungChung: string;
    ngayLapDatThietBi: number | Date | null;
    thoiDiemPhatSinh: number | Date | null;
    ngayBatDauDungChung: number | Date | null;
    ngayKetThucDungChung: number | Date | null;
  };
  hopDongTramKyThanhToanList: IHopDongKyThanhToan[];
  hopDongTramPhuTroList: {
    id: number;
    gia: number;
    hienThiThongTinChiTiet: boolean;
    createdAt: Date | number;
    dmLoaiHopDongPhuTro: IDmLoaiHDPhuTro;
    hopDongTramId: number;
  }[];
};

export interface PheDuyetListOfHopDongOptions {
  hopDongId: number;
}

export type IHopDongPheDuyetStatus =
  | 'CHO_PHE_DUYET'
  | 'PHE_DUYET'
  | 'TU_CHOI'
  | 'GUI_LAI'
  | 'UPDATE_HOP_DONG';
export type IHopDongDamPhanStatus = 'GUI_DAM_PHAN' | 'PHE_DUYET' | 'TU_CHOI';
export type ILoaiXetDuyetHopDong = 'XET_DUYET_HOP_DONG' | 'XET_DUYET_PHU_LUC';
export interface ITienTrinhPheDuyet {
  changeLog: string;
  changeLogClob: string;
  ghiChu: string;
  hopDongPheDuyetId: number;
  id: number;
  nguoiDungId: number;
  nguoiDung: INguoiDung;
  trangThaiPheDuyet: IHopDongPheDuyetStatus;
  createdAt: Date | number;
}
export interface IHopDongPheDuyet {
  createdAt: Date | number;
  ghiChu: string;
  hopDongId: number;
  hopDongPheDuyetNguoiNhanModelList: {
    nguoiDungId: number;
    nguoiDung: INguoiDung;
    hopDongPheDuyetId: number;
    id: number;
  }[];
  hopDongPheDuyetTienTrinhList: ITienTrinhPheDuyet[];
  id: number;
  loaiXetDuyet: ILoaiXetDuyetHopDong;
  nguoiGui: INguoiDung;
  nguoiGuiId: number;
  trangThaiPheDuyetMoiNhat: IHopDongPheDuyetStatus;
}

export interface HopDongPheDuyetPaginator extends PaginatorInfo<IHopDongPheDuyet> {}

export type IImportHopDong = {
  dongSo: number;
  soHopDong: string;
  soHopDongErp: string;
  maTram: string;
  tenTram: string;
  maTramErp: string;
  maDTXD: string;
  tinh: string;
  huyen: string;
  xa: string;
  khuVuc: string;
  phongDai: string;
  to: string;
  diaChiDatTram: string;
  kinhDo: number;
  viDo: number;
  loaiTram: string;
  loaiCSHT: string;
  tinhTrangPhatSong: 'Đã phát sóng' | 'Chưa phát sóng';
  loaiCotAnten: string;
  loaiThietBiRan: string;
  hinhThucKyHopDong: string;
  hinhThucDauTu: string;
  doiTuongKyHopDong: string;
  hinhThucThanhToan: string;
  thueVAT: string;
  kyQuy: string;
  giaKyQuy: number;
  khoanMuc: string;
  ngayKyHopDong: string;
  ngayKetThucHopDong: string;
  ghiChu: string;
  giaThue: number;
  chuKyThanhToan: string;
  ngayBatDauYeuCauThanhToan: string;
  giaDienKhoan: number;
  ngayPhatSong: string;
  doCaoCotAnten: string;

  daThanhToanDenNgay: string;
  kyThanhToanKeTiep: string;

  hoTenChuNha: string;
  diaChiLienHe: string;
  soDienThoai: string;
  maSoThue: string;
  cccd: string;
  chuTaiKhoan: string;
  soTaiKhoan: string;
  nganHangChiNhanh: string;

  thuePhongMay: string;
  thuePhongMayDatMayNoCoDinh: string;
  thueBaoVe: string;
  thuePhongMayDatDuPhong: string;
  thueCotAnten: string;
  viTriAnten: string;
  tiepDatChongSet: string;
  htDienIndoor: string;

  loaiHangMucCsht: string;
  maTramDonViDungChung: string;
  donViDungChung: string;
  thoiDiemPhatSinh: string;
  ngayLapDatThietBi: string;
  ngayBatDauDungChung: string;
  ngayKetThucDungChung: string;

  loaiPhongMay: string;
  loaiPhongMayPhatDien: string;
  loaiTramVhkt: string;
  errors: {
    status: {
      maTram: boolean;
      maTramErp: boolean;
      soHopDong: boolean;
      soHopDongErp: boolean;
      phongDai: boolean;
      to: boolean;
      tinh: boolean;
      huyen: boolean;
      xa: boolean;
      khuVuc: boolean;
      loaiCsht: boolean;
      loaiTram: boolean;
      loaiThietBiRan: boolean;
      loaiCotAnten: boolean;
      hinhThucKyHopDong: boolean;
      hinhThucDauTu: boolean;
      doiTuongKyHopDong: boolean;
      hinhThucThanhToan: boolean;
      thueVAT: boolean;
      ngayPhatSong: boolean;
      ngayKyHopDong: boolean;
      ngayKetThucHopDong: boolean;
      giaThue: boolean;
      chuKyThanhToan: boolean;
      ngayBatDauYeuCauThanhToan: boolean;
      hoTenChuNha: boolean;
      diaChiLienHe: boolean;
      chuTaiKhoan: boolean;
      soTaiKhoan: boolean;
      nganHangChiNhanh: boolean;
      loaiHangMucCsht: boolean;
      maTramDonViDungChung: boolean;
      loaiPhongMay: boolean;
      loaiPhongMayPhatDien: boolean;
      loaiTramVhkt: boolean;
      khoanMuc: boolean;
      donViDungChung: boolean;
    };
    message: string[];
  };
};

export type IHopDongImportInput = {
  tramId: number | null;
  soHopDong: string;
  soHopDongErp: string | null;
  hinhThucKyId: number | null;
  hinhThucDauTuId: number | null;
  doiTuongKyId: number | null;
  khoanMucId: number | null;
  coKyQuy: boolean;
  giaKyQuy: number | null;
  ngayKy: string;
  ngayKetThuc: string;
  ghiChu: string;
  giaThue: number;
  thueVat: number | null;
  hinhThucThanhToanId: number | null;
  chuKyNam: number | null;
  chuKyThang: number | null;
  chuKyNgay: number | null;
  ngayBatDauYeuCauThanhToan: string;
  giaDienKhoan: number | null;
  loaiPhongMayId: number | null;
  loaiPhongMayPhatDienId: number | null;
  loaiTramVhktId: number | null;
  loaiHopDong: ILoaiHopDong;
  tram: {
    id: number | null;
    phongDaiId: number | null;
    toId: number | null;
    maTram: string;
    maTramErp: string | null;
    ten: string;
    tinhId: number | null;
    huyenId: number | null;
    xaId: number | null;
    diaChi: string;
    kinhDo: string | null;
    viDo: string | null;
    khuVucId: number | null;
    ngayPhatSong: string | null;
    daPhatSong: boolean;
    loaiCshtId: number | null;
    loaiTramId: number | null;
    loaiCotAngtenId: number | null;
    doCaoAngten: string | null;
    dmLoaiThietBiRanList: IDmLoaiThietBiRan[] | null;
    maDauTuXayDung: string | null;
    trangThaiHoatDong: 'HOAT_DONG' | 'NGUNG_HOAT_DONG';
  };
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
  hopDongDungChung: {
    loaiHangMucCSHTId: number | null;
    maTramDonViDungChung: string;
    donViDungChungId: number | null;
    thoiDiemPhatSinh: string;
    ngayLapDatThietBi: string;
    ngayBatDauDungChung: string;
    ngayKetThucDungChung: string;
  } | null;
  hopDongPhuTroList:
    | { gia: number; hienThiThongTinChiTiet: boolean; dmPhuTroId: number | null }[]
    | null;
  hopDongKyThanhToanList: { tuNgay: Date; denNgay: Date; giaTien?: number }[];
  hopDongPhuLucList: { ghiChu: string }[] | null;
};

export type IDataDanhMuc = {
  dataTram: ITram[];
  dataPhongDai: OptionTypeTram[];
  dataTo: IDmTo[];
  dataTinh: IDmTinh[];
  dataHuyen: IDmHuyen[];
  dataXa: IDmXa[];
  dataKhuVuc: IDmTramKhuVuc[];
  dataDoiTuongKyHopDong: IDmDoiTuongKyHopDong[];
  dataHinhThucDauTu: IDmHinhThucDauTu[];
  dataHinhThucKyHopDong: IDmHinhThucKyHopDong[];
  dataHinhThucThanhToan: IDmHinhThucThanhToan[];
  dataLoaiCotAnten: IDmLoaiCotAnten[];
  dataLoaiCsht: IDmLoaiCsht[];
  dataLoaiThietBiRan: IDmLoaiThietBiRan[];
  dataLoaiTram: IDmLoaiTram[];
  dataThueVAt: IDmThue[];
  dataHDPhuTro: IDmLoaiHDPhuTro[];
  dataLoaiPhongMay: IDmLoaiPhongMay[];
  dataLoaiPhongMayPhatDien: IDmLoaiPhongMayPhatDien[];
  dataLoaiTramVhkt: IDmLoaiTramVhkt[];
  dataLoaiHangMucCsht: IDmLoaiHangMucCsht[];
  dataKhoanMuc: IDmKhoanMuc[];
  dataDonViDungChung: IDmDonViDungChung[];
};

export type IFilterAdvancedHopDong = {
  from: string | null;
  to: string | null;
  maTram: string | null;
  soHopDong: string | null;
  soHopDongErp: string | null;
  ngayKyFrom: string | null;
  ngayKyTo: string | null;
  ngayKetThucFrom: string | null;
  ngayKetThucTo: string | null;
  hinhThucDauTuId: string | null;
  hinhThucKyHopDongId: string | null;
  doiTuongKyHopDongId: string | null;
  tinhTrangThanhToan: string | null;
  idTinh: string | null;
  idHuyen: string | null;
  idXa: string | null;
  phongDaiId: string | null;
  tinhTrangHopDong: string | null;
  kyThanhToanFrom: string | null;
  kyThanhToanTo: string | null;
};

export type IFilterAdvancedHopDongForm = {
  from: string | null;
  to: string | null;
  maTram: OptionTypeTram | null;
  soHopDong: string | null;
  soHopDongErp: string | null;
  ngayKyFrom: string | null;
  ngayKyTo: string | null;
  ngayKetThucFrom: string | null;
  ngayKetThucTo: string | null;
  hinhThucDauTuId: OptionTypeTram | null;
  hinhThucKyHopDongId: OptionTypeTram | null;
  doiTuongKyHopDongId: OptionTypeTram | null;
  tinhTrangThanhToan: OptionTypeTram | null;
  idTinh: OptionTypeTram | null;
  idHuyen: OptionTypeTram | null;
  idXa: OptionTypeTram | null;
  phongDaiId: OptionTypeTram | null;
  tinhTrangHopDong: OptionTypeTram | null;
  kyThanhToanFrom: string | null;
  kyThanhToanTo: string | null;
};

export type IKyThanhToanForm = {
  tuNgay: Date;
  denNgay: Date;
  gia: number;
  daThanhToanNgay: Date | null;
  daThanhToan: boolean;
};

export type IHopDongTramForm = { id: number | ''; ma: string; maErp: string; maDTXD: string };
export type IHopDongHangMucTramForm = {
  status: 'old' | 'new';
  tram: IHopDongTramForm;
  giaThueTram: number;
  dienKhoan: {
    added: boolean;
    gia: number;
  };
  // Phu tro
  phuTroList: {
    gia: number | '';
    hienThiThongTinChiTiet: boolean;
    dmPhuTroId: number | '';
  }[];
  // Chu ky thanh toan
  hopDongKyThanhToanList: IKyThanhToanForm[];
  ngayBatDauTT: Date;
  // Dùng chung
  isDungChung: boolean;
  loaiHangMucCsht: { id: number; ten: string } | null;
  maDonViDungChung: string;
  donViDungChung: { id: number; ten: string } | null;
  thoiDiemPhatSinh: Date | number | null;
  ngayLapDatThietBi: Date | number | null;
  ngayBatDauDungChung: Date | number | null;
  ngayKetThucDungChung: Date | number | null;
  filesDungChung: {
    file: File;
    status: 'old' | 'new';
    createdAt?: Date;
    id?: number;
    // loai?: string;
    path?: string;
    ten?: string;
  }[];
};

export type IChuKy = {
  from: Date;
  to: Date;
  gia: number;
};

export type IHopDongPhuLuc = {
  id: number;
  ghiChu: string;
  nguoiTao: {
    id: number;
    hoTen: string;
    email: string;
  };
  soPhuLuc: string;
  tinhTrangPhuLuc: 'HOAT_DONG' | 'DUNG_HOAT_DONG';
  createdAt: Date | number;
  ngayHieuLuc: Date | number;
  ngayKetThuc: Date | number;
  ngayKy: Date | number;
};

export interface IOldFilesHopDong {
  path: string;
  filePath: string;
  soHopDong: string;
}

export type IExportHopDong = {
  search: string;
  loaiHopDong: ILoaiHopDong;
  trangThaiHopDong: ITrangThaiHopDongQuery;
  listId: string[];
  from?: string | null;
  to?: string | null;
  maTram?: string | null;
  soHopDong?: string | null;
  soHopDongErp?: string | null;
  ngayKyFrom?: string | null;
  ngayKyTo?: string | null;
  ngayKetThucFrom?: string | null;
  ngayKetThucTo?: string | null;
  hinhThucDauTuId?: string | null;
  hinhThucKyHopDongId?: string | null;
  doiTuongKyHopDongId?: string | null;
  tinhTrangThanhToan?: string | null;
  idTinh?: string | null;
  idHuyen?: string | null;
  idXa?: string | null;
  phongDai?: string | null;
  listKey: string;
  excludeKey: string;
};

export type ITinhTrangHopDong = 'KY_MOI' | 'TAI_KY' | 'DI_DOI' | 'THANH_LY';
