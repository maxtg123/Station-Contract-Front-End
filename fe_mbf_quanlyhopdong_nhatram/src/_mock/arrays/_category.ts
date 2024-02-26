import _mock from '../_mock';
import { randomInArray } from '../utils';

// ----------------------------------------------------------------------

export const _creategoryLoaiCSHT = [...Array(24)].map((_, index) => ({
  ten_csht: `Indoor ${index}`,
  ma_csht: `INDOOR${index}`,
  ghi_chu: _mock.text.description(index),
  ngay_tao: `${index < 9 ? `0${index + 1}` : index + 1}/04/2023`,
  trangthai: randomInArray(['Đang sử dụng', 'Chưa sử dụng']),
}));
export const _creategoryHinhThucDauTu = [...Array(24)].map((_, index) => ({
  ten_htdt: `Hình thức đầu tư ${index}`,
  ma_htdt: `HTDT${index}`,
  ghi_chu: _mock.text.description(index),
  ngay_tao: `${index < 9 ? `0${index + 1}` : index + 1}/04/2023`,
  trangthai: randomInArray(['Đang sử dụng', 'Chưa sử dụng']),
}));
export const _creategoryDoiTuongKHD = [...Array(24)].map((_, index) => ({
  ten_doituong_khd: `Đối tượng KHD ${index}`,
  ma_doituong_khd: `DTKHD${index}`,
  ghi_chu: _mock.text.description(index),
  ngay_tao: `${index < 9 ? `0${index + 1}` : index + 1}/04/2023`,
  trangthai: randomInArray(['Đang sử dụng', 'Chưa sử dụng']),
}));
export const _creategoryLoaiCotAnten = [...Array(24)].map((_, index) => ({
  ten_loaicot_anten: `Cột anten ${index}`,
  ma_loaicot_anten: `COTANTEN${index}`,
  ghi_chu: _mock.text.description(index),
  ngay_tao: `${index < 9 ? `0${index + 1}` : index + 1}/04/2023`,
  trangthai: randomInArray(['Đang sử dụng', 'Chưa sử dụng']),
}));
export const _creategoryPhongDai = [...Array(50)].map((_, index) => ({
  ten_phongdai: `Đài viễn thông ${index}`,
  ma_phongdai: `PD${index}`,
  loai_phongdai: randomInArray([
    'Phòng Vô Tuyến',
    'Phòng Truyền Dẫn',
    'Phòng Hạ Tầng',
    'Đài viễn thông Bình Dương',
    'Đài viễn thông Tiền Giang',
    'Đài viễn thông Cần Thơ',
    'Đài viễn thông Đồng Nai',
    'Đài viễn thông Tây HCM',
    'Đài viễn thông Đông HCM',
  ]),
  ghi_chu: `Ghi chú ${index}`,
  ngay_tao: `${index < 9 ? `0${index + 1}` : index + 1}/04/2023`,
  trangthai: randomInArray(['Đang sử dụng', 'Chưa sử dụng']),
}));
export const _creategoryTo = [...Array(50)].map((_, index) => ({
  ten_to: `Tổ viễn thông ${index}`,
  ma_to: `TO${index}`,
  ma_phongdai: `${index + 1}`,
  ten_phongdai: randomInArray([
    'Phòng Vô Tuyến',
    'Phòng Truyền Dẫn',
    'Phòng Hạ Tầng',
    'Đài viễn thông Bình Dương',
    'Đài viễn thông Tiền Giang',
    'Đài viễn thông Cần Thơ',
    'Đài viễn thông Đồng Nai',
    'Đài viễn thông Tây HCM',
    'Đài viễn thông Đông HCM',
  ]),
  ghi_chu: `Ghi chú ${index}`,
  ngay_tao: `${index < 9 ? `0${index + 1}` : index + 1}/04/2023`,
  trangthai: randomInArray(['Đang sử dụng', 'Chưa sử dụng']),
}));

export const _creategoryHangMucThue = [...Array(24)].map((_, index) => ({
  ten_hangmucthue: `Hạng mục thuê CSHT ${index}`,
  ma_hangmucthue: `HMT${index}`,
  ghi_chu: _mock.text.description(index),
  ngay_tao: `${index < 9 ? `0${index + 1}` : index + 1}/04/2023`,
  trangthai: randomInArray(['Đang sử dụng', 'Chưa sử dụng']),
}));
export const _creategoryTinh = [...Array(24)].map((_, index) => ({
  ma_tinh: `${index + 1}`,
  ten_tinh: `Bến tre ${index + 1}`,
  cap: `Tỉnh`,
  ghi_chu: `Ghi chú ${index + 1}`,
  ngay_tao: `${index < 9 ? `0${index + 1}` : index + 1}/04/2023`,
  trangthai: randomInArray(['Đang sử dụng', 'Chưa sử dụng']),
}));
export const _creategoryHuyenQuan = [...Array(24)].map((_, index) => ({
  ma_huyen_quan: `${index + 1}`,
  ten_huyen_quan: `Thạnh Phú ${index + 1}`,
  cap: `Huyện`,
  ghi_chu: `Ghi chú ${index + 1}`,
  ngay_tao: `${index < 9 ? `0${index + 1}` : index + 1}/04/2023`,
  trangthai: randomInArray(['Đang sử dụng', 'Chưa sử dụng']),
}));
export const _creategoryPhuongXa = [...Array(24)].map((_, index) => ({
  ma_phuong_xa: `${index + 1}`,
  ten_phuong_xa: `Thới Thạnh ${index + 1}`,
  cap: `Xã`,
  ghi_chu: `Ghi chú ${index + 1}`,
  ngay_tao: `${index < 9 ? `0${index + 1}` : index + 1}/04/2023`,
  trangthai: randomInArray(['Đang sử dụng', 'Chưa sử dụng']),
}));
