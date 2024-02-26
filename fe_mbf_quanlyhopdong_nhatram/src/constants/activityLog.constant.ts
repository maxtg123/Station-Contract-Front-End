import { IHead } from 'src/@types/common';

export const TABLE_HEAD_ACTIVITY_LOG: IHead[] = [
  {
    id: 'module',
    value: 'module',
    label: 'Module',
    align: 'left',
    checked: true,
  },
  {
    id: 'action',
    value: 'action',
    label: 'Hành động',
    align: 'left',
    checked: true,
    minWidth: 160,
  },
  {
    id: 'changeLog',
    value: 'changeLog',
    label: 'Nội dung',
    align: 'left',
    checked: true,
    minWidth: 300,
  },
  {
    id: 'nguoiDung',
    value: 'nguoiDung',
    label: 'Người thực hiện',
    align: 'left',
    checked: true,
    minWidth: 180,
  },
  {
    id: 'createdAt',
    value: 'createdAt',
    label: 'Ngày thực hiện',
    checked: true,
    minWidth: 220,
    type: 'Date',
  },
];

export const LABELS_MAP_MODULE: Record<string, string> = {
  TRAM: 'Trạm',
  DANH_MUC: 'Danh mục',
};
export const LABELS_MAP_ACTION: Record<string, string> = {
  /**
   * * HOP_DONG - XET DUYET
   */
  CREATE: 'Thêm mới',
  UPDATE: 'Cập nhật',
  DELETE: 'Xoá',
  XET_DUYET: 'Xét duyệt',
};

export const LABEL_COLORS_ACTION: Record<string, string> = {
  CREATE: 'success',
  UPDATE: 'warning',
  DELETE: 'error',
  XET_DUYET: 'secondary',
};

export const MAP_ACTION: Record<string, string> = {
  create: 'Thêm mới',
  update: 'Cập nhật',
  delete: 'Xoá',
};
