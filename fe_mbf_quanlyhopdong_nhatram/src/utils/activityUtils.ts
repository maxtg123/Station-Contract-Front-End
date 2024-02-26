import { IChangeLog } from 'src/@types/activityLog';
import { IResultDiff, ITypeValue } from './logUtils';

type IActivityLogResult = IResultDiff[];
export const transform = (changeLog: IChangeLog): IActivityLogResult | null => {
  if (!changeLog) return [];
  const { changes, version } = changeLog;
  console.log('changes: ', changes);
  if (version === '0.0.0') {
    return changes.map((c) => ({
      title: getField(c.paths),
      oldValue: c.oldValue as any,
      value: c.value as any,
      typeValue: getType(c.paths),
      type: convertTypeChange(c.type),
      path: c.paths,
    }));
  }
  return [];
};

const convertTypeChange = (type: string): 'CHANGE' | 'REMOVE' | 'CREATE' => {
  if (type === 'update') {
    return 'CHANGE';
  }
  if (type === 'create') {
    return 'CREATE';
  }
  return 'CHANGE';
};

const getField = (path: (string | number)[]): string => {
  if (isSingleField(path)) {
    if (path.includes('phongDai')) {
      return 'Phòng/Đài';
    }
    if (path.includes('to')) {
      return 'Tổ';
    }
    if (path.includes('maTram')) {
      return 'Mã trạm';
    }
    if (path.includes('maDauTuXayDung')) {
      return 'Mã đầu tư xây dựng';
    }
    if (path.includes('ngayPhatSong')) {
      return 'Ngày phát sóng';
    }
    if (path.includes('daPhatSong')) {
      return 'Đã phát sóng';
    }
    if (path.includes('ten')) {
      return 'Tên';
    }
    if (path.includes('maTramErp')) {
      return 'Mã trạm ERP';
    }
    if (path.includes('siteNameErp')) {
      return 'Site name ERP';
    }
    if (path.includes('loaiCsht')) {
      return 'Loại CSHT';
    }
    if (path.includes('loaiTram')) {
      return 'Loại trạm';
    }
    if (path.includes('trangThaiHoatDong')) {
      return 'Trạng thái hoạt động';
    }
    if (path.includes('ghiChu')) {
      return 'Ghi chú';
    }
    if (path.includes('tinh')) {
      return 'Tỉnh';
    }
    if (path.includes('huyen')) {
      return 'Huyện';
    }
    if (path.includes('xa')) {
      return 'Xã';
    }
    if (path.includes('khuVuc')) {
      return 'Khu vực';
    }
    if (path.includes('kinhDo')) {
      return 'Kinh độ';
    }
    if (path.includes('viDo')) {
      return 'Vĩ độ';
    }
    if (path.includes('loaiCotAngten')) {
      return 'Loại cột Angten';
    }
    if (path.includes('doCaoAngten')) {
      return 'Độ cao Angten';
    }
    if (path.includes('maDataSite')) {
      return 'Mã DataSite';
    }
    if (path.includes('ma')) {
      return 'Mã';
    }
    if (path.includes('tenVietTat')) {
      return 'Tên viết tắt';
    }
    if (path.includes('diaChi')) {
      return 'Địa chỉ';
    }
    if (path.includes('dmLoaiThietBiRanList')) {
      return 'Loại thiết bị Ran';
    }
  }
  return '';
};

const getType = (path: (string | number)[]): ITypeValue => {
  if (isSingleField(path)) {
    if (path.includes('ngayPhatSong')) {
      return 'date';
    }
    if (path.includes('daPhatSong')) {
      return 'bool';
    }
  }
  return 'string';
};

const isSingleField = (path: (string | number)[]): boolean => {
  return path.length === 1;
};
