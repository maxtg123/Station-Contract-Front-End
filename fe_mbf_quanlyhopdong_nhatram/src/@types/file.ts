// ----------------------------------------------------------------------

import { ILoaiFileHopDong } from './hopdong';

export type IFileData = {
  id: number;
  file?: IFile;
  createdAt: Date | number;
  loai: ILoaiFileHopDong;
  path: string;
  ten: string;
  hopDongPhuLucId: number | null;
  hopDongTramId: number | null;
};

export type IFile = {
  name: string;
  size: number;
  type: string;
};

export type IFileShared = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  permission: string;
};

export type IFolderManager = {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  tags: string[];
  totalFiles?: number;
  isFavorited: boolean;
  shared: IFileShared[] | null;
  dateCreated: Date | number | string;
  dateModified: Date | number | string;
};

export type IFileManager = {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  tags: string[];
  isFavorited: boolean;
  shared: IFileShared[] | null;
  dateCreated: Date | number | string;
  dateModified: Date | number | string;
};

// export type IFile = IFileManager | IFolderManager;
