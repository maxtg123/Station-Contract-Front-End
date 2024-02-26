import { Difference } from 'microdiff';
import { ILogPheDuyetVersion } from 'src/@types/hopdongmatbang';

export type ITypeValue = 'array' | 'string' | 'date' | 'bool';

export type IResultDiff = Difference & {
  title: string;
  oldValue?: any;
  value?: any;
  typeValue: ITypeValue;
};

export const convertDiffHopDong = (
  changeLog: {
    data: Difference[];
    version: ILogPheDuyetVersion;
  } | null
): IResultDiff[] => {
  if (!changeLog) return [];
  const { data, version } = changeLog;
  console.log('data: ', data);
  if (version === '0.0.0') {
    return cleanDiff(data).map((dt) => {
      return {
        title: getTitle(dt.path),
        typeValue: getTypeValue(dt.path),
        ...dt,
      };
    });
  }
  return [];
};

const getTitle = (path: (string | number)[]): string => {
  if (isSingleField(path)) {
    if (path.includes('soHopDong')) {
      return 'Số hợp đồng';
    }
    if (path.includes('ghiChu')) {
      return 'Ghi chú';
    }
    if (path.includes('soHopDongERP')) {
      return 'Số hợp đồng ERP';
    }
    if (path.includes('ngayKy')) {
      return 'Ngày ký';
    }
    if (path.includes('ngayKetThuc')) {
      return 'Ngày kết thúc';
    }
    if (path.includes('coKyQuy')) {
      return 'Có ký quỹ';
    }
    if (path.includes('giaKyQuy')) {
      return 'Giá ký quỹ';
    }
    if (path.includes('thueVAT')) {
      return 'Thuế VAT';
    }
    if (path.includes('chuKyNam')) {
      return 'Chu kỳ năm';
    }
    if (path.includes('chuKyThang')) {
      return 'Chu kỳ tháng';
    }
    if (path.includes('chuKyNgay')) {
      return 'Chu kỳ ngày';
    }
  }

  if (isSingleObject(path)) {
    if (path.includes('hinhThucKy')) {
      return 'Hình thức ký';
    }
    if (path.includes('hinhThucDauTu')) {
      return 'Hình thức đầu tư';
    }
    if (path.includes('doiTuongKy')) {
      return 'Đối tượng ký';
    }
  }
  return '';
};

const getTypeValue = (path: (string | number)[]): ITypeValue => {
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

const inTram = (path: (string | number)[]): boolean => {
  return path.length > 2 && path.includes('hangMucs');
};

export const getActionName = (type: 'CHANGE' | 'REMOVE' | 'CREATE'): string => {
  switch (type) {
    case 'CHANGE':
      return 'được thay đổi';
    case 'REMOVE':
      return 'bị xoá';
    case 'CREATE':
      return 'được thêm mới';
    default:
      return '';
  }
};

export const cleanDiff = (diff: Difference[]): Difference[] => {
  return diff.filter((d) => {
    const { path } = d;
    if (isSingleObject(path)) {
      if (path.includes('hinhThucKy') && path.includes('id')) {
        return false;
      }
      if (path.includes('hinhThucDauTu') && path.includes('id')) {
        return false;
      }
      if (path.includes('doiTuongKy') && path.includes('id')) {
        return false;
      }
    }
    return true;
  });
};
