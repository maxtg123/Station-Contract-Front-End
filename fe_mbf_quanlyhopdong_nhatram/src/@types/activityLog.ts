import { IAction } from './chucvu';
import { PaginationQueryOptions, PaginatorInfo } from './common';
import { INguoiDung } from './nguoidung';
import { IModule } from './thongbao';

export type IActivityLogVersion = '0.0.0' | '0.0.1';

export type IChangeLog = {
  forModel: { id: number; name: string };
  changes: {
    paths: string[];
    oldValue: string;
    value: string;
    type: 'update' | 'create' | 'delete';
  }[];
  version: IActivityLogVersion;
};

export type IActivityLog = {
  id: number;
  module: IModule;
  action: IAction;
  changeLog: string;
  nguoiDung: INguoiDung;
  createdAt: number | Date;
};
export interface ActivityLogQueryOptions extends PaginationQueryOptions {
  module: string;
  from: Date | null;
  to: Date | null;
}
export interface ActivityLogPaginator extends PaginatorInfo<IActivityLog> {}
