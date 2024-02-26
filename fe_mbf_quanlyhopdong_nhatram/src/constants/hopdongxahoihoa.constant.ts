import { IColumnMapping, IHead, IHeadGroupColumn } from 'src/@types/common';

export const HOP_DONG_XA_HOI_HOA = 'hop-dong-xa-hoi-hoa';
export const TABLE_HEAD_HOP_DONG_XA_HOI_HOA: IHead[] = [
  {
    id: 'soHopDong',
    value: 'soHopDong',
    label: 'Số hợp đồng',
    align: 'left',
    checked: true,
    minWidth: 250,
  },
  {
    id: 'soHopDongErp',
    value: 'soHopDongErp',
    label: 'Số hợp đồng ERP',
    align: 'left',
    checked: true,
    minWidth: 160,
  },
  {
    id: 'hopDongDoiTac.ten',
    value: 'hopDongDoiTac.ten',
    label: 'Tên đối tác',
    align: 'left',
    checked: true,
    minWidth: 160,
  },
  {
    id: 'hopDongDoiTac.diaChi',
    value: 'hopDongDoiTac.diaChi',
    label: 'Địa chỉ liên hệ',
    align: 'left',
    checked: true,
    minWidth: 260,
  },
  {
    id: 'ngayKy',
    value: 'ngayKy',
    label: 'Ngày ký HĐ',
    align: 'left',
    checked: true,
    minWidth: 160,
    type: 'Date',
  },
  {
    id: 'ngayKetThuc',
    value: 'ngayKetThuc',
    label: 'Ngày kết thúc HĐ',
    align: 'left',
    checked: true,
    minWidth: 160,
    type: 'Date',
  },
  {
    id: 'hopDongDoiTac.maSoThue',
    value: 'hopDongDoiTac.maSoThue',
    label: 'Mã số thuế',
    align: 'left',
    checked: true,
    minWidth: 160,
  },
  {
    id: 'hopDongDoiTac.cccd',
    value: 'hopDongDoiTac.cccd',
    label: 'Số CMND/CCCD',
    align: 'left',
    checked: true,
    minWidth: 160,
  },
  {
    id: 'hopDongDoiTac.soDienThoai',
    value: 'hopDongDoiTac.soDienThoai',
    label: 'Số điện thoại',
    align: 'left',
    checked: true,
    minWidth: 160,
  },
  {
    id: 'thueVat',
    value: 'thueVat',
    label: 'Thuế VAT',
    align: 'left',
    checked: true,
    minWidth: 160,
    format: `#value%`,
  },
  {
    id: 'chuKyTT',
    value: 'chuKyNam,chuKyThang,chuKyNgay',
    label: 'Chu kỳ thanh toán',
    align: 'left',
    checked: true,
    minWidth: 200,
  },
  {
    id: 'hopDongDoiTac.chuTaiKhoan',
    value: 'hopDongDoiTac.chuTaiKhoan',
    label: 'Chủ tài khoản',
    align: 'left',
    checked: true,
    minWidth: 160,
  },
  {
    id: 'hopDongDoiTac.soTaiKhoan',
    value: 'hopDongDoiTac.soTaiKhoan',
    label: 'Số tài khoản',
    align: 'left',
    checked: true,
    minWidth: 200,
  },
  {
    id: 'hopDongDoiTac.nganHangChiNhanh',
    value: 'hopDongDoiTac.nganHangChiNhanh',
    label: 'Ngân hàng chi nhánh',
    align: 'left',
    checked: true,
    minWidth: 220,
  },
  {
    id: 'dmHinhThucThanhToan.ten',
    value: 'dmHinhThucThanhToan.ten',
    label: 'Hình thức thanh toán',
    align: 'left',
    checked: true,
    minWidth: 200,
  },
  {
    id: 'dmDoiTuongKyHopDong.ten',
    value: 'dmDoiTuongKyHopDong.ten',
    label: 'Đối tượng ký hợp đồng',
    align: 'left',
    checked: true,
    minWidth: 200,
  },
  {
    id: 'dmHinhThucKyHopDong.ten',
    value: 'dmHinhThucKyHopDong.ten',
    label: 'Hình thức ký hợp đồng',
    align: 'left',
    checked: true,
    minWidth: 200,
  },
  {
    id: 'dmKhoanMuc.ma',
    value: 'dmKhoanMuc.ma',
    label: 'Khoản mục',
    align: 'left',
    checked: true,
    minWidth: 160,
  },
  {
    id: 'ghiChu',
    value: 'ghiChu',
    label: 'Ghi chú',
    align: 'left',
    checked: true,
    minWidth: 260,
  },
  {
    id: 'createdAt',
    value: 'createdAt',
    label: 'Ngày tạo',
    align: 'left',
    checked: true,
    minWidth: 160,
    type: 'Date',
  },
  {
    id: 'updatedAt',
    value: 'updatedAt',
    label: 'Ngày cập nhật lần cuối',
    align: 'left',
    checked: true,
    minWidth: 200,
    type: 'Date',
  },
  {
    id: 'coKyQuy',
    value: 'coKyQuy',
    label: 'Ký quỹ',
    align: 'center',
    checked: true,
    minWidth: 80,
  },
  {
    id: 'giaKyQuy',
    value: 'giaKyQuy',
    label: 'Giá ký quỹ',
    align: 'center',
    checked: true,
    minWidth: 120,
    type: 'Price',
  },
  {
    id: 'hopDongPhuLucModels',
    value: 'hopDongPhuLucModels',
    label: 'Phụ lục',
    align: 'center',
    checked: true,
    minWidth: 180,
  },
];

export const HEAD_ROWS_IMPORT = [
  'dongSo',
  'soHopDong',
  'soHopDongErp',
  'maTram',
  'tenTram',
  'maTramErp',
  'maDTXD',
  'tinh',
  'huyen',
  'xa',
  'khuVuc',
  'phongDai',
  'to',
  'diaChiDatTram',
  'kinhDo',
  'viDo',
  'loaiTram',
  'loaiCSHT',
  'loaiThietBiRan',
  'loaiCotAnten',
  'doCaoCotAnten',
  'luuLuong',
  'ngayPhatSong',
  'tinhTrangHopDong',
  'hinhThucKyHopDong',
  'hinhThucDauTu',
  'doiTuongKyHopDong',
  'kyQuy',
  'giaKyQuy',
  'ngayKyHopDong',
  'ngayKetThucHopDong',
  'toTrinh',
  'giaThue',
  'giaDienKhoan',
  'thueVAT',
  'chuKyThanhToan',
  'hinhThucThanhToan',
  'ngayBatDauYeuCauThanhToan',
  'daThanhToanDenNgay',
  'kyThanhToanKeTiep',
  'hoTenChuNha',
  'diaChiLienHe',
  'soDienThoai',
  'maSoThue',
  'cccd',
  'chuTaiKhoan',
  'soTaiKhoan',
  'nganHangChiNhanh',
  'thuePhongMay',
  'thuePhongMayDatMayNoCoDinh',
  'thueBaoVe',
  'thuePhongMayDatDuPhong',
  'thueCotAnten',
  'viTriAnten',
  'tiepDatChongSet',
  'htDienIndoor',
  'loaiHangMucCsht',
  'maTramDonViDungChung',
  'donViDungChung',
  'thoiDiemPhatSinh',
  'ngayLapDatThietBi',
  'ngayBatDauDungChung',
  'ngayKetThucDungChung',
  'ghiChu',
  'loaiTramVhkt',
  'loaiPhongMay',
  'loaiPhongMayPhatDien',
];

export const COLUMN_MAPPING_HOP_DONG_XA_HOI_HOA: IColumnMapping = {
  '6': 'dongSo',
  'Số HĐ (*)': 'soHopDong',
  'Số HĐ ERP': 'soHopDongErp',
  'Mã trạm (*)': 'maTram',
  'Tên trạm': 'tenTram',
  'Mã trạm ERP': 'maTramErp',
  'Mã ĐTXD': 'maDTXD',
  'Tỉnh/thành phố (*)': 'tinh',
  'Quận/huyện': 'huyen',
  'Phường/xã': 'xa',
  'Khu vực': 'khuVuc',
  'Phòng/Đài viễn thông (*)': 'phongDai',
  'Tổ viễn thông': 'to',
  'Địa chỉ đặt trạm': 'diaChiDatTram',
  'Kinh độ': 'kinhDo',
  'Vĩ độ': 'viDo',
  'Loại trạm': 'loaiTram',
  'Loại CSHT': 'loaiCSHT',
  'Loại thiết bị RAN': 'loaiThietBiRan',
  'Loại cột anten': 'loaiCotAnten',
  'Độ cao anten (m)': 'doCaoCotAnten',
  'Lưu lượng': 'luuLuong',
  'Tình trạng phát sóng': 'tinhTrangPhatSong',
  'Ngày phát sóng': 'ngayPhatSong',
  'Tình trạng hợp đồng': 'tinhTrangHopDong',
  'Hình thức ký hợp đồng': 'hinhThucKyHopDong',
  'Hình thức đầu tư': 'hinhThucDauTu',
  'Khoản mục': 'khoanMuc',
  'Đối tượng ký hợp đồng': 'doiTuongKyHopDong',
  'Ký quỹ': 'kyQuy',
  'Giá ký quỹ': 'giaKyQuy',
  'Ngày ký HĐ (*)': 'ngayKyHopDong',
  'Ngày kết thúc HĐ (*)': 'ngayKetThucHopDong',
  'Tờ trình': 'toTrinh',
  'Giá thuê (*)': 'giaThue',
  'Giá điện khoán': 'giaDienKhoan',
  'Thuế VAT (%)': 'thueVAT',
  'Chu kỳ thanh toán (*)': 'chuKyThanhToan',
  'Hình thức thanh toán': 'hinhThucThanhToan',
  'Ngày bắt đầu yêu cầu thanh toán (*)': 'ngayBatDauYeuCauThanhToan',
  'Đã thanh toán đến ngày': 'daThanhToanDenNgay',
  'Kỳ thanh toán kế tiếp': 'kyThanhToanKeTiep',
  'Họ tên chủ nhà (*)': 'hoTenChuNha',
  'Địa chỉ liên hệ (*)': 'diaChiLienHe',
  'Số điện thoại chủ nhà': 'soDienThoai',
  'Mã số thuế': 'maSoThue',
  'Số CCCD/CMND': 'cccd',
  'Chủ tài khoản': 'chuTaiKhoan',
  'Số tài khoản': 'soTaiKhoan',
  'Ngân hàng - Chi nhánh': 'nganHangChiNhanh',
  'Thuê phòng máy': 'thuePhongMay',
  'Thuê phòng máy đặt máy nổ cố định': 'thuePhongMayDatMayNoCoDinh',
  'Thuê bảo vệ, hỗ trợ vận hành khai thác máy nổ và PCCC cho trạm': 'thueBaoVe',
  'Thuê MPĐ dự phòng': 'thuePhongMayDatDuPhong',
  'Thuê cột anten': 'thueCotAnten',
  'Vị trí anten': 'viTriAnten',
  'Tiếp đất, chống sét': 'tiepDatChongSet',
  'HT điện indoor (tủ nguồn, CB,...)': 'htDienIndoor',
  'Loại hạng mục CSHT': 'loaiHangMucCsht',
  'Mã trạm đơn vị cho dùng chung': 'maTramDonViDungChung',
  'Đơn vị dùng chung': 'donViDungChung',
  'Thời điểm phát sinh (ngày)': 'thoiDiemPhatSinh',
  'Ngày lắp đặt thiết bị': 'ngayLapDatThietBi',
  'Ngày bắt đầu dùng chung': 'ngayBatDauDungChung',
  'Ngày kết thúc dùng chung': 'ngayKetThucDungChung',
  'Ghi chú': 'ghiChu',
  'Phân loại trạm (VHKT)': 'loaiTramVhkt',
  'Loại phòng máy': 'loaiPhongMay',
  'Loại phòng máy phát điện': 'loaiPhongMayPhatDien',
};

export const TABLE_HEAD_IMPORT_HOP_DONG_XA_HOI_HOA: IHead[] = [
  { id: 'dongSo', value: 'dongSo', label: 'Dòng số', align: 'center', minWidth: 90 },
  { id: 'tinhTrang', value: 'tinhTrang', label: 'Tình trạng', align: 'center', minWidth: 100 },
  { id: 'chiTietLoi', value: 'chiTietLoi', label: 'Chi tiết lỗi', align: 'left', minWidth: 300 },
  { id: 'soHopDong', value: 'soHopDong', label: 'Số HĐ (*)', align: 'left', minWidth: 150 },
  { id: 'soHopDongErp', value: 'soHopDongErp', label: 'Số HĐ ERP', align: 'left', minWidth: 150 },
  { id: 'maTram', value: 'maTram', label: 'Mã trạm (*)', align: 'left', minWidth: 150 },
  { id: 'tenTram', value: 'tenTram', label: 'Tên trạm', align: 'left', minWidth: 150 },
  { id: 'maTramErp', value: 'maTramErp', label: 'Mã trạm ERP', align: 'left', minWidth: 150 },
  { id: 'maDTXD', value: 'maDTXD', label: 'Mã ĐTXD', align: 'left', minWidth: 150 },
  { id: 'tinh', value: 'tinh', label: 'Tỉnh/Thành phố (*)', align: 'left', minWidth: 160 },
  { id: 'huyen', value: 'huyen', label: 'Quận/huyện', align: 'left', minWidth: 150 },
  { id: 'xa', value: 'xa', label: 'Phường/Xã', align: 'left', minWidth: 150 },
  { id: 'khuVuc', value: 'khuVuc', label: 'Khu vực', align: 'left', minWidth: 150 },
  {
    id: 'phongDai',
    value: 'phongDai',
    label: 'Phòng/Đài viễn thông (*)',
    align: 'left',
    minWidth: 200,
  },
  { id: 'to', value: 'to', label: 'Tổ viễn thông', align: 'left', minWidth: 150 },
  {
    id: 'diaChiDatTram',
    value: 'diaChiDatTram',
    label: 'Địa chỉ đặt trạm',
    align: 'left',
    minWidth: 250,
  },
  { id: 'kinhDo', value: 'kinhDo', label: 'Kinh độ', align: 'left', minWidth: 150 },
  { id: 'viDo', value: 'viDo', label: 'Vĩ độ', align: 'left', minWidth: 150 },
  { id: 'loaiTram', value: 'loaiTram', label: 'Loại trạm', align: 'left', minWidth: 150 },
  { id: 'loaiCSHT', value: 'loaiCSHT', label: 'Loại CSHT', align: 'left', minWidth: 150 },
  {
    id: 'loaiThietBiRan',
    value: 'loaiThietBiRan',
    label: 'Loại thiết bị RAN',
    align: 'left',
    minWidth: 150,
  },
  {
    id: 'loaiCotAnten',
    value: 'loaiCotAnten',
    label: 'Loại cột anten',
    align: 'left',
    minWidth: 150,
  },
  {
    id: 'doCaoCotAnten',
    value: 'doCaoCotAnten',
    label: 'Độ cao cột anten',
    align: 'left',
    minWidth: 160,
  },
  {
    id: 'luuLuong',
    value: 'luuLuong',
    label: 'Lưu lượng',
    align: 'left',
    minWidth: 120,
  },
  {
    id: 'ngayPhatSong',
    value: 'ngayPhatSong',
    label: 'Ngày phát sóng (*)',
    align: 'left',
    minWidth: 170,
  },
  {
    id: 'tinhTrangHopDong',
    value: 'tinhTrangHopDong',
    label: 'Tình trạng hợp đồng',
    align: 'left',
    minWidth: 180,
  },
  {
    id: 'hinhThucKyHopDong',
    value: 'hinhThucKyHopDong',
    label: 'Hình thức ký hợp đồng',
    align: 'left',
    minWidth: 200,
  },
  {
    id: 'hinhThucDauTu',
    value: 'hinhThucDauTu',
    label: 'Hình thức đầu tư',
    align: 'left',
    minWidth: 180,
  },
  {
    id: 'doiTuongKyHopDong',
    value: 'doiTuongKyHopDong',
    label: 'Đối tượng ký hợp đồng',
    align: 'left',
    minWidth: 200,
  },
  {
    id: 'kyQuy',
    value: 'kyQuy',
    label: 'Ký quỹ',
    align: 'left',
    minWidth: 120,
  },
  {
    id: 'giaKyQuy',
    value: 'giaKyQuy',
    label: 'Giá ký quỹ',
    align: 'left',
    minWidth: 150,
  },
  {
    id: 'ngayKyHopDong',
    value: 'ngayKyHopDong',
    label: 'Ngày ký HĐ (*)',
    align: 'left',
    minWidth: 160,
  },
  {
    id: 'ngayKetThucHopDong',
    value: 'ngayKetThucHopDong',
    label: 'Ngày kết thúc HĐ (*)',
    align: 'left',
    minWidth: 180,
  },
  {
    id: 'toTrinh',
    value: 'toTrinh',
    label: 'Tờ trình',
    align: 'left',
    minWidth: 130,
  },
  {
    id: 'giaThue',
    value: 'giaThue',
    label: 'Giá thuê (*)',
    align: 'left',
    minWidth: 200,
    type: 'Price',
  },
  {
    id: 'giaDienKhoan',
    value: 'giaDienKhoan',
    label: 'Giá điện khoán',
    align: 'left',
    minWidth: 200,
    type: 'Price',
  },
  {
    id: 'thueVAT',
    value: 'thueVAT',
    label: 'Thuế VAT (%)',
    align: 'left',
    minWidth: 160,
    format: `#value%`,
  },
  {
    id: 'chuKyThanhToan',
    value: 'chuKyThanhToan',
    label: 'Chu kỳ thanh toán (*)',
    align: 'left',
    minWidth: 180,
  },
  {
    id: 'hinhThucThanhToan',
    value: 'hinhThucThanhToan',
    label: 'Hình thức thanh toán',
    align: 'left',
    minWidth: 180,
  },
  {
    id: 'ngayBatDauYeuCauThanhToan',
    value: 'ngayBatDauYeuCauThanhToan',
    label: 'Ngày bắt đầu yêu cầu thanh toán (*)',
    align: 'left',
    minWidth: 270,
  },
  {
    id: 'daThanhToanDenNgay',
    value: 'daThanhToanDenNgay',
    label: 'Đã thanh toán đến ngày',
    align: 'left',
    minWidth: 220,
  },
  {
    id: 'kyThanhToanKeTiep',
    value: 'kyThanhToanKeTiep',
    label: 'Kỳ thanh toán kế tiếp',
    align: 'left',
    minWidth: 270,
  },
  {
    id: 'hoTenChuNha',
    value: 'hoTenChuNha',
    label: 'Họ tên chủ nhà (*)',
    align: 'left',
    minWidth: 170,
  },
  {
    id: 'diaChiLienHe',
    value: 'diaChiLienHe',
    label: 'Địa chỉ liên hệ (*)',
    align: 'left',
    minWidth: 250,
  },
  {
    id: 'soDienThoai',
    value: 'soDienThoai',
    label: 'Số điện thoại chủ nhà',
    align: 'left',
    minWidth: 200,
  },
  {
    id: 'maSoThue',
    value: 'maSoThue',
    label: 'Mã số thuế',
    align: 'left',
    minWidth: 150,
  },
  {
    id: 'cccd',
    value: 'cccd',
    label: 'Số CCCD/CMND (*)',
    align: 'left',
    minWidth: 200,
  },
  {
    id: 'chuTaiKhoan',
    value: 'chuTaiKhoan',
    label: 'Chủ tài khoản (*)',
    align: 'left',
    minWidth: 200,
  },
  {
    id: 'soTaiKhoan',
    value: 'soTaiKhoan',
    label: 'Số tài khoản (*)',
    align: 'left',
    minWidth: 200,
  },
  {
    id: 'nganHangChiNhanh',
    value: 'nganHangChiNhanh',
    label: 'Ngân hàng - Chi nhánh (*)',
    align: 'left',
    minWidth: 200,
  },
  {
    id: 'thuePhongMay',
    value: 'thuePhongMay',
    label: 'Thuê phòng máy',
    align: 'left',
    minWidth: 200,
  },
  {
    id: 'thuePhongMayDatMayNoCoDinh',
    value: 'thuePhongMayDatMayNoCoDinh',
    label: 'Thuê phòng máy đặt máy nổ cố định',
    align: 'left',
    minWidth: 280,
  },
  {
    id: 'thueBaoVe',
    value: 'thueBaoVe',
    label: 'Thuê bảo vệ, hỗ trợ vận hành khai thác máy nổ và PCCC cho trạm',
    align: 'left',
    minWidth: 280,
  },
  {
    id: 'thuePhongMayDatDuPhong',
    value: 'thuePhongMayDatDuPhong',
    label: 'Thuê PMĐ dự phòng',
    align: 'left',
    minWidth: 200,
  },
  {
    id: 'thueCotAnten',
    value: 'thueCotAnten',
    label: 'Thuê cột anten',
    align: 'left',
    minWidth: 180,
  },
  {
    id: 'viTriAnten',
    value: 'viTriAnten',
    label: 'Vị trí Anten',
    align: 'left',
    minWidth: 180,
  },
  {
    id: 'tiepDatChongSet',
    value: 'tiepDatChongSet',
    label: 'Tiếp đất, chống sét',
    align: 'left',
    minWidth: 200,
  },
  {
    id: 'htDienIndoor',
    value: 'htDienIndoor',
    label: 'HT điện indoor (tủ nguồn, CB,...)',
    align: 'left',
    minWidth: 260,
  },
  {
    id: 'loaiHangMucCsht',
    value: 'loaiHangMucCsht',
    label: 'Loại hạng mục CSHT',
    align: 'left',
    minWidth: 200,
  },
  {
    id: 'maTramDonViDungChung',
    value: 'maTramDonViDungChung',
    label: 'Mã trạm đơn vị cho dùng chung',
    align: 'left',
    minWidth: 230,
  },
  {
    id: 'donViDungChung',
    value: 'donViDungChung',
    label: 'Đơn vị dùng chung',
    align: 'left',
    minWidth: 180,
  },
  {
    id: 'thoiDiemPhatSinh',
    value: 'thoiDiemPhatSinh',
    label: 'Thời điểm phát sinh',
    align: 'left',
    minWidth: 180,
  },
  {
    id: 'ngayLapDatThietBi',
    value: 'ngayLapDatThietBi',
    label: 'Ngày lắp đặt thiết bị',
    align: 'left',
    minWidth: 180,
  },
  {
    id: 'ngayBatDauDungChung',
    value: 'ngayBatDauDungChung',
    label: 'Ngày bắt đầu dùng chung',
    align: 'left',
    minWidth: 180,
  },
  {
    id: 'ngayKetThucDungChung',
    value: 'ngayKetThucDungChung',
    label: 'Ngày kết thúc dùng chung',
    align: 'left',
    minWidth: 180,
  },
  {
    id: 'ghiChu',
    value: 'ghiChu',
    label: 'Ghi chú',
    align: 'left',
    minWidth: 180,
  },
  {
    id: 'loaiTramVhkt',
    value: 'loaiTramVhkt',
    label: 'Phân loại trạm (VHKT)',
    align: 'left',
    minWidth: 200,
  },
  {
    id: 'loaiPhongMay',
    value: 'loaiPhongMay',
    label: 'Loại phòng máy',
    align: 'left',
    minWidth: 180,
  },
  {
    id: 'loaiPhongMayPhatDien',
    value: 'loaiPhongMayPhatDien',
    label: 'Loại phòng máy phát điện',
    align: 'left',
    minWidth: 250,
  },
];

export const TABLE_HEADER_IMPORT_HOP_DONG_XA_HOI_HOA_GROUP_COLUMN: IHeadGroupColumn[] = [
  {
    id: 'thongTinHopDong',
    colSpan: 36,
    label: 'Thông tin hợp đồng',
  },
  {
    id: 'giaThue',
    colSpan: 8,
    label: 'Giá thuê',
  },
  {
    id: 'thongTinDoiTac',
    colSpan: 5,
    label: 'Thông tin đối tác',
  },
  {
    id: 'thongTinThuHuong',
    colSpan: 3,
    label: 'Thông tin thụ hưởng',
  },

  {
    id: 'phuTroGiathue',
    colSpan: 8,
    label: 'Phụ trợ + Giá thuê',
  },

  {
    id: 'dungChungCsht',
    colSpan: 8,
    label: 'Dùng chung CSHT',
  },
  {
    id: 'dataSite',
    colSpan: 3,
    label: 'Data Site',
  },
];

export const TABLE_HEADER_IMPORT_HOP_DONG_XA_HOI_HOA_GROUP_COLUMN_DATA_VALID: IHeadGroupColumn[] = [
  {
    id: 'thongTinHopDong',
    colSpan: 35,
    label: 'Thông tin hợp đồng',
  },
  {
    id: 'giaThue',
    colSpan: 8,
    label: 'Giá thuê',
  },
  {
    id: 'thongTinDoiTac',
    colSpan: 5,
    label: 'Thông tin đối tác',
  },
  {
    id: 'thongTinThuHuong',
    colSpan: 3,
    label: 'Thông tin thụ hưởng',
  },

  {
    id: 'phuTroGiathue',
    colSpan: 8,
    label: 'Phụ trợ + Giá thuê',
  },
  {
    id: 'dungChungCsht',
    colSpan: 8,
    label: 'Dùng chung CSHT',
  },
  {
    id: 'dataSite',
    colSpan: 3,
    label: 'Data Site',
  },
];

export const DRAG_HOP_DONG_XA_HOI_HOA_COL = 'dragColumnHopDongXaHoiHoa';

export const TINH_TRANG_HOP_DONG = {
  nhap: 'NHAP',
  choGuiPheDuyet: 'CHO_GUI_PHE_DUYET',
  daGuiPheDuyet: 'DA_GUI_PHE_DUYET',
  choPheDuyet: 'CHO_PHE_DUYET',
  hoatDong: 'HOAT_DONG',
};

export const TRANG_THAI_HOAT_DONG = {
  NHAP: 'NHAP',
  CHO_PHE_DUYET: 'CHO_PHE_DUYET',
  HOAT_DONG: 'HOAT_DONG',
};

export const HEAD_HOP_DONG_XA_HOI_HOA_TRAM_LIST: IHead[] = [
  // {
  //   id: 'tram.dmPhongDai.ten',
  //   value: 'tram.dmPhongDai.ten',
  //   label: 'Phòng/Đài',
  //   align: 'left',
  //   checked: true,
  //   minWidth: 220,
  // },
  // {
  //   id: 'tram.dmTo.ten',
  //   value: 'tram.dmTo.ten',
  //   label: 'Tổ VT',
  //   align: 'left',
  //   checked: true,
  //   minWidth: 150,
  // },
  {
    id: 'tram.maTram',
    value: 'tram.maTram',
    label: 'Mã trạm',
    align: 'left',
    checked: true,
    minWidth: 150,
  },
  {
    id: 'tram.maTramErp',
    value: 'tram.maTramErp',
    label: 'Mã trạm ERP',
    align: 'left',
    checked: true,
    minWidth: 150,
  },
  {
    id: 'tram.maDauTuXayDung',
    value: 'tram.maDauTuXayDung',
    label: 'Mã đầu tư xây dựng',
    align: 'left',
    checked: true,
    minWidth: 180,
  },
  {
    id: 'tram.ten',
    value: 'tram.ten',
    label: 'Tên trạm',
    align: 'left',
    checked: true,
    minWidth: 160,
  },
  {
    id: 'tram.trangThaiHoatDong',
    value: 'tram.trangThaiHoatDong',
    label: 'Trạng thái trạm',
    align: 'left',
    checked: true,
    minWidth: 120,
  },
  {
    id: 'tram.dmTinh.ten',
    value: 'tram.dmTinh.ten',
    label: 'Tỉnh/TP',
    align: 'left',
    checked: true,
    minWidth: 160,
  },
  {
    id: 'tram.dmHuyen.ten',
    value: 'tram.dmHuyen.ten',
    label: 'Quận/Huyện',
    align: 'left',
    checked: true,
    minWidth: 160,
  },
  {
    id: 'tram.dmXa.ten',
    value: 'tram.dmXa.ten',
    label: 'Phường/Xã',
    align: 'left',
    checked: true,
    minWidth: 160,
  },
  {
    id: 'tram.diaChi',
    value: 'tram.diaChi',
    label: 'Địa chỉ trạm',
    align: 'left',
    checked: true,
    minWidth: 260,
  },
  {
    id: 'giaThue',
    value: 'giaThue',
    label: 'Giá thuê trạm (+VAT)',
    align: 'left',
    checked: true,
    minWidth: 220,
    type: 'Price',
  },
  {
    id: 'ngayBatDauYeuCauThanhToan',
    value: 'hopDongTramKyThanhToanList',
    label: 'Ngày bắt đầu thanh toán',
    align: 'left',
    checked: true,
    minWidth: 260,
  },
  {
    id: 'daThanhToanDenNgay',
    value: 'hopDongTramKyThanhToanList',
    label: 'Đã thanh toán đến ngày',
    align: 'left',
    checked: true,
    minWidth: 260,
  },
  {
    id: 'kyThanhToanKeTiep',
    value: 'hopDongTramKyThanhToanList',
    label: 'Kỳ thanh toán kế tiếp',
    align: 'left',
    checked: true,
    minWidth: 260,
  },
  {
    id: 'tinhTrangThanhToan',
    value: 'hopDongTramKyThanhToanList',
    label: 'Tình trạng thanh toán',
    align: 'left',
    checked: true,
    minWidth: 260,
  },
  {
    id: 'giaDienKhoan',
    value: 'giaDienKhoan',
    label: 'Điện khoán',
    align: 'left',
    checked: true,
    minWidth: 160,
    type: 'Price',
  },
  {
    id: 'hopDongTramDungChung.maTramDonViDungChung',
    value: 'hopDongTramDungChung.maTramDonViDungChung',
    label: 'Mã trạm đơn vị dùng chung',
    align: 'center',
    checked: true,
    minWidth: 220,
  },
  {
    id: 'hopDongTramDungChung.donViDungChung',
    value: 'hopDongTramDungChung.donViDungChung',
    label: 'Đơn vị dùng chung',
    align: 'center',
    checked: true,
    minWidth: 200,
  },
];

export const HEAD_HOP_DONG_XA_HOI_HOA_DA_GUI_PHE_DUYET: IHead[] = [
  {
    id: 'hopDongPheDuyetList.trangThai',
    value: 'hopDongPheDuyetList.trangThai',
    label: 'Trạng thái phê duyệt',
    align: 'left',
    checked: true,
    minWidth: 170,
  },
  ...TABLE_HEAD_HOP_DONG_XA_HOI_HOA,
  // {
  //   id: 'hopDongPheDuyetList.nguoiGui',
  //   value: 'hopDongPheDuyetList.nguoiGui',
  //   label: 'Người gửi',
  //   align: 'left',
  //   checked: true,
  //   minWidth: 150,
  // },
  // {
  //   id: 'hopDongPheDuyetList.ngayGui',
  //   value: 'hopDongPheDuyetList.ngayGui',
  //   label: 'Ngày gửi',
  //   align: 'left',
  //   checked: true,
  //   minWidth: 150,
  // },
  // {
  //   id: 'hopDongPheDuyetList.nguoiPheDuyet',
  //   value: 'hopDongPheDuyetList.nguoiPheDuyet',
  //   label: 'Người phê duyệt',
  //   align: 'left',
  //   checked: true,
  //   minWidth: 150,
  // },
];

const endDetailHeadThongTinTram = 8;

const temp = HEAD_HOP_DONG_XA_HOI_HOA_TRAM_LIST.slice(0, endDetailHeadThongTinTram);

export const HEAD_HOP_DONG_XA_HOI_HOA_THONG_TIN_TRAM_DETAIL: IHead[] = [...temp];