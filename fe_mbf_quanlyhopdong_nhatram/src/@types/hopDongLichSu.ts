import { PaginationQueryOptions, PaginatorInfo } from './common';
import { ILoaiHopDong } from './hopdong';
import { INguoiDung } from './nguoidung';

export type IHopDongLSVersion = '0.0.0' | '0.0.1';

export type IHopDongLichSu = {
  changeLog: string;
  version: IHopDongLSVersion;
  hopDongId: number;
  nguoiDungId: number;
  nguoiDung: INguoiDung;
};

export type IChangeLogHDLS = {
  data: {
    path: string[];
    type: 'CHANGE' | 'CREATE' | 'REMOVE';
    value: string | number;
    oldValue: string | number;
  }[];
};

export type HopDongLichSuQueryOptions = PaginationQueryOptions & {
  loaiHopDong?: ILoaiHopDong;
  hopDongId?: number;
};

export interface HopDongLichSuPaginator extends PaginatorInfo<IHopDongLichSu> {}
