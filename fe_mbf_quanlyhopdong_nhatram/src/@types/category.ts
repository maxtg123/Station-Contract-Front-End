import { OptionTypeTram } from './common';

export type IDmResponse = {
  elements: { id: number; ten: string; ma: string; ghiChu: string; createdAt: number | Date };
  metadata?: {
    page: number;
    perPage: number;
    pageCount: number;
  };
  status?: {
    success: boolean;
    errors: null | string;
    code: number;
  };
};
// Loại csht
export type IDmLoaiCsht = {
  id: number;
  ten: string;
  ma: string;
  ghiChu: string;
  createdAt: number | Date;
};

export type IDmLoaiCshtInput = {
  ten: string;
  ma: string;
  ghiChu: string;
};

// Hình thức đầu tư
export type IDmHinhThucDauTu = {
  id: number;
  ten: string;
  ma: string;
  ghiChu: string;
  createdAt: number | Date;
};
export type IDmHinhThucDauTuInput = {
  ten: string;
  ma: string;
  ghiChu: string;
};

// Đối tượng ký hợp đồng
export type ILoaiDoiTuong = 'PHAP_NHAN' | 'CA_NHAN' | 'KHAC';
export type IDmDoiTuongKyHopDong = {
  id: number;
  ten: string;
  ma: string;
  loaiDoiTuong: ILoaiDoiTuong;
  ghiChu: string;
  createdAt: number | Date;
};
export type IDmDoiTuongKyHopDongInput = {
  ten: string;
  ma: string;
  loaiDoiTuong: ILoaiDoiTuong;
  ghiChu: string;
};
// Loại cột Anten

export type IDmLoaiCotAnten = {
  id: number;
  ten: string;
  ma: string;
  ghiChu: string;
  createdAt: number | Date;
};
export type IDmLoaiCotAntenInput = {
  ten: string;
  ma: string;
  ghiChu: string;
};

// Phòng đài
export type IDmPhongDai = {
  id: number;
  ten: string;
  tenVietTat: string;
  ghiChu: string;
  maDataSite: string;
  createdAt: number | Date;
  loai: 'Đài' | 'Phòng';
};
export type IDmPhongDaiInput = {
  ten: string;
  tenVietTat: string;
  maDataSite: string;
  ghiChu: string;
  loai: 'Đài' | 'Phòng' | string;
};

// Tổ
export type IDmTo = {
  id: number;
  ten: string;
  ghiChu: string;
  tenVietTat: string;
  maDataSite: string;
  phongDai: IDmPhongDai;
  createdAt: number | Date;
};
export type IDmToInput = {
  ten: string;
  maDataSite: string;
  tenVietTat: string;
  ghiChu: string;
  phongDai: OptionTypeTram | null;
};

// Hạng mục thuê

export type IDmHangMucThue = {
  id: number;
  ten: string;
  ghiChu: string;
  ma: string;
  createdAt: number | Date;
};
export type IDmHangMucThueInput = {
  ten: string;
  ma: string;
  ghiChu: string;
};

// Tỉnh
export type IDmTinh = {
  id: number;
  ten: string;
  ghiChu: string;
  ma: string;
  createdAt: number | Date;
};
export type IDmTinhInput = {
  ten: string;
  ma: string;
  ghiChu: string;
};

// Huyện
export type IDmHuyen = {
  id: number;
  ten: string;
  ghiChu: string;
  ma: string;
  tinh: IDmTinh;
  createdAt: number | Date;
};
export type IDmHuyenInput = {
  ten: string;
  ma: string;
  ghiChu: string;
  tinh: Pick<IDmTinh, 'ma' | 'ten'>;
};

// Xã
export type IDmXa = {
  id: number;
  ten: string;
  ghiChu: string;
  ma: string;
  createdAt: number | Date;
  huyen: IDmHuyen;
};
export type IDmXaInput = {
  ten: string;
  ma: string;
  ghiChu: string;
  huyen: Pick<IDmHuyen, 'ma' | 'ten'>;
};

// Trạm khu vực

export type IDmTramKhuVuc = {
  id: number;
  ten: string;
  ghiChu: string;
  ma: string;
  createdAt: number | Date;
};
export type IDmTramKhuVucInput = {
  ten: string;
  ma: string;
  ghiChu: string;
};

// Loại trạm

export type IDmLoaiTram = {
  id: number;
  ten: string;
  ghiChu: string;
  ma: string;
  createdAt: number | Date;
};
export type IDmLoaiTramInput = {
  ten: string;
  ma: string;
  ghiChu: string;
};

// Loại thiết bị RAN

export type IDmLoaiThietBiRan = {
  id: number;
  ten: string;
  ghiChu: string;
  ma: string;
  createdAt: number | Date;
};
export type IDmLoaiThietBiRanInput = {
  ten: string;
  ma: string;
  ghiChu: string;
};

// Thuế
export type IDmThue = {
  id: number;
  soThue: number;
  ghiChu: string;
  createdAt: number | Date;
};
export type IDmThueInput = {
  soThue: number;
  ghiChu: string;
};

// Loại phòng máy
export type IDmLoaiPhongMay = {
  id: number;
  ten: string;
  ghiChu: string;
  ma: string;
  maDataSite: string;
  createdAt: number | Date;
};
export type IDmLoaiPhongMayInput = {
  ten: string;
  ghiChu: string;
  ma: string;
  maDataSite: string;
};

// Hợp đồng phụ trợ
export type IDmLoaiHDPhuTro = {
  id: number;
  ma: string;
  ten: string;
  gia: number;
  maDataSite: string;
  createdAt: number | Date;
  ghiChu: string;
};
export type IDmLoaiHDPhuTroInput = {
  ma: string;
  ten: string;
  gia: number;
};

// Hình thức ký hợp đồng
export type IDmHinhThucKyHD = {
  createdAt: number | Date;
  id: number;
  maDataSite: string;
  ten: string;
  ma: string;
  ghiChu: string;
};
export type IDmHinhThucKyHDInput = {
  maDataSite: string;
  ten: string;
  ma: string;
  ghiChu: string;
};
// Hình thức thanh toán
export type IDmHinhThucThanhToan = {
  id: number;
  ten: string;
  ma: string;
  ghiChu: string;
  createdAt: number | Date;
};

export type IDmHinhThucThanhToanInput = {
  ten: string;
  ma: string;
  ghiChu: string;
};

// Hình thức ký hợp đồng

export type IDmHinhThucKyHopDong = {
  id: number;
  ten: string;
  ghiChu: string;
  ma: string;
  createdAt: number | Date;
};
export type IDmHinhThucKyHopDongInput = {
  ten: string;
  ma: string;
  ghiChu: string;
};

// Loại hạng mục csht
export type IDmLoaiHangMucCsht = {
  id: number;
  ten: string;
  ma: string;
  ghiChu: string;
  createdAt: number | Date;
};
export type IDmLoaiHangMucCshtInput = {
  ten: string;
  ma: string;
  ghiChu: string;
};

// Loại trạm vhkt
export type IDmLoaiTramVhkt = {
  id: number;
  ten: string;
  ma: string;
  ghiChu: string;
  createdAt: number | Date;
};
export type IDmLoaiLoaiTramVhktInput = {
  ten: string;
  ma: string;
  ghiChu: string;
};

// Loại phòng máy phát điện
export type IDmLoaiPhongMayPhatDien = {
  id: number;
  ten: string;
  ma: string;
  ghiChu: string;
  createdAt: number | Date;
};
export type IDmLoaiPhongMayPhatDienInput = {
  ten: string;
  ma: string;
  ghiChu: string;
};

// Đơn vị dùng chung
export type IDmDonViDungChung = {
  id: number;
  ten: string;
  ma: string;
  ghiChu: string;
  createdAt: number | Date;
};
export type IDmDonViDungChungInput = {
  ten: string;
  ma: string;
  ghiChu: string;
};

// Khoản mục
export type IDmKhoanMuc = {
  id: number;
  ten: string;
  ma: string;
  ghiChu: string;
  createdAt: number | Date;
};
export type IDmKhoanMucInput = {
  ten: string;
  ma: string;
  ghiChu: string;
};