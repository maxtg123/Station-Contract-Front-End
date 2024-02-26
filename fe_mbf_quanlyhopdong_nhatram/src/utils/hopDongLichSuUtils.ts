import { IChangeLogHDLS, IHopDongLSVersion } from 'src/@types/hopDongLichSu';
import { fDateTime } from './formatTime';
import { IResultDiff, ITypeValue, cleanDiff } from './logUtils';

type IHopDongLichSuResult = IResultDiff[];

export const transform = (
  changeLog: IChangeLogHDLS,
  version: IHopDongLSVersion
): IHopDongLichSuResult | null => {
  if (!changeLog) return [];
  const { data } = changeLog;
  if (version === '0.0.0') {
    return cleanDiff(data).map((c) => ({
      title: getField(c.path),
      oldValue: checkOldValue(c.oldValue),
      value: checkValue(c.value),
      typeValue: getType(c.path),
      type: c.type,
      path: c.path,
    }));
  }
  return [];
};

const getField = (path: (string | number)[]): string => {
  if (path.includes('hangMucs')) {
    if (path.includes('hopDongKyThanhToanList')) {
      if (path.includes('tuNgay')) {
        return `Ngày ký hợp đồng của mã trạm ${path[1]}`;
      }
      if (path.includes('denNgay')) {
        return `Ngày kết thúc hợp đồng của mã trạm ${path[1]}`;
      }
      if (path.includes('gia')) {
        return `Giá trị hợp đồng thứ ${Number(path[3]) + 1} của mã trạm ${path[1]}`;
      }
      return `Hợp đồng kỳ thanh toán thứ ${Number(path[3]) + 1} của mã trạm ${path[1]}`;
    }
    if (path.includes('dienKhoan')) {
      if (path.includes('added')) {
        return `Trạng thái thêm điện khoán của mã trạm ${path[1]}`;
      }
      if (path.includes('gia')) {
        return `Giá trị điện khoán của mã trạm ${path[1]}`;
      }
      return `Điện khoán của mã trạm ${path[1]}`;
    }
    if (path.includes('giaThueTram')) {
      return `Giá thuê trạm của mã trạm ${path[1]}`;
    }
    return 'Hạng mục';
  }

  if (isSingleField(path)) {
    if (path.includes('chuKyNam')) {
      return 'Chu kỳ năm';
    }
    if (path.includes('chuKyNgay')) {
      return 'Chu kỳ ngày';
    }
    if (path.includes('chuKyThang')) {
      return 'Chu kỳ tháng';
    }
    if (path.includes('coKyQuy')) {
      return 'Có ký quỹ';
    }
    if (path.includes('giaKyQuy')) {
      return 'Giá ký quỹ';
    }
    if (path.includes('tinhTrangHopDong')) {
      return 'Tình trạng hợp đồng';
    }
    if (path.includes('ghiChu')) {
      return 'Ghi chú';
    }
    if (path.includes('loaiHopDong')) {
      return 'Loại hợp đồng';
    }
    if (path.includes('ngayKetThuc')) {
      return 'Ngày kết thúc';
    }
    if (path.includes('ngayKy')) {
      return 'Ngày ký';
    }
    if (path.includes('soHopDong')) {
      return 'Số hợp đồng';
    }
    if (path.includes('soHopDongErp') || path.includes('soHopDongERP')) {
      return 'Số hợp đồng ERP';
    }
    if (path.includes('thueVat') || path.includes('thueVAT')) {
      return 'Thuế VAT';
    }
    if (path.includes('trangThaiHopDong')) {
      return 'Trạng thái hợp đồng';
    }
    if (path.includes('hopDongFileModels')) {
      return 'File hợp đồng Mẫu';
    }
    if (path.includes('hopDongTramList')) {
      return 'Hợp đồng trạm';
    }
    if (path.includes('hopDongDamPhanList')) {
      return 'Hợp đồng đàm phán';
    }
    if (path.includes('hopDongPhuLucModels')) {
      return 'Mẫu HĐ phụ lục';
    }
    if (path.includes('hopDongPheDuyetList')) {
      return 'Hợp đồng phê duyệt';
    }
    if (path.includes('tenDoiTac')) {
      return 'Tên đối tác';
    }
    if (path.includes('sdt')) {
      return 'Số điện thoại đối tác';
    }
    if (path.includes('soCMND')) {
      return 'Số CMND/CCCD đối tác';
    }
    if (path.includes('maSoThue')) {
      return 'MST đối tác';
    }
    if (path.includes('diaChiLienHe')) {
      return 'Địa chỉ liên hệ';
    }
    if (path.includes('chuTaiKhoan')) {
      return 'Chủ tài khoản';
    }
    if (path.includes('soTaiKhoan')) {
      return 'Số tài khoản';
    }
    if (path.includes('nganHangChiNhanh')) {
      return 'Ngân hàng chi nhánh';
    }
    if (path.includes('ghiChuPhuLuc')) {
      return 'Phụ lục';
    }
  }

  if (isSingleObject(path)) {
    if (path.includes('doiTuongKy')) {
      return 'Đối tượng ký hợp đồng';
    }
    if (path.includes('hinhThucDauTu')) {
      return 'Hình thức đầu tư';
    }
    if (path.includes('hinhThucKy')) {
      if (path.includes('ten')) return 'Tên Hình thức ký';
      return 'Hình thức ký hợp đồng';
    }
    if (path.includes('hinhThucThanhToan')) {
      return 'Hình thức thanh toán';
    }
    if (path.includes('khoanMuc')) {
      return 'Khoản mục';
    }
    if (path.includes('hopDongDoiTac')) {
      return 'Hợp đồng đối tác';
    }
    if (path.includes('filesDinhKem')) {
      return 'File đính kèm';
    }
  }
  return path.toString();
};

const getType = (path: (string | number)[]): ITypeValue => {
  if (isSingleField(path)) {
    if (path.includes('ngayKy')) {
      return 'date';
    }
    if (path.includes('ngayKetThuc')) {
      return 'date';
    }
    if (path.includes('coKyQuy')) {
      return 'bool';
    }
  }
  return 'string';
};

const isSingleField = (path: (string | number)[]): boolean => {
  return path.length === 1;
};
const isSingleObject = (path: (string | number)[]): boolean => {
  return path.length === 2;
};

const checkValue = (value?: any) => {
  if (typeof value === 'object') {
    if (value?.file) {
      return value.file.path;
    }
    return value?.ten || '';
  }
  if (typeof value === 'string') {
    if (new Date(value) != 'Invalid Date') {
      return fDateTime(value);
    }
    return value;
  }
  return value;
};
const checkOldValue = (value?: any) => {
  if (typeof value === 'object') {
    if (value?.gia) {
      return value.gia;
    }
    return value?.ten || '';
  }
  if (typeof value === 'string') {
    if (new Date(value) != 'Invalid Date') {
      return fDateTime(value);
    }
    return value;
  }
  return value;
};
