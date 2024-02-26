import { IHead } from 'src/@types/common';

export const TABLE_HEAD_THONG_BAO: IHead[] = [
  {
    id: 'module',
    value: 'module',
    label: 'Module',
    align: 'left',
    checked: true,
    minWidth: 250,
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
    id: 'content',
    value: 'content',
    label: 'Nội dung',
    align: 'left',
    checked: true,
    minWidth: 300,
  },
  {
    id: 'trangThai',
    value: 'trangThai',
    label: 'Trạng thái',
    align: 'left',
    checked: true,
    minWidth: 160,
  },
  {
    id: 'nguoiGui',
    value: 'nguoiGui',
    label: 'Người gửi',
    align: 'left',
    checked: true,
    minWidth: 180,
  },
  // {
  //   id: 'nguoiNhan',
  //   value: 'nguoiNhan',
  //   label: 'Người nhận',
  //   align: 'left',
  //   checked: true,
  //   minWidth: 180,
  // },
  {
    id: 'updatedAt',
    value: 'updatedAt',
    label: 'Thời gian đã đọc',
    checked: true,
    minWidth: 220,
    type: 'Date',
  },
  {
    id: 'createdAt',
    value: 'createdAt',
    label: 'Thời gian',
    checked: true,
    minWidth: 220,
    type: 'Date',
  },
];

export const TRANG_THAI_THONG_BAO = {
  chuaXem: 'CHUA_XEM',
  daXem: 'XEM',
};

export const LABELS_MAP_STATUS: Record<string, string> = {
  CHUA_XEM: 'Chưa đọc',
  XEM: 'Đã đọc',
};
export const LABELS_MAP_MODULE: Record<string, string> = {
  HOP_DONG: 'Hợp đồng',
  TRAM: 'Trạm',
  THANH_TOAN: 'Thanh toán',
  DAM_PHAN: 'Đàm phán',
};
export const LABELS_MAP_ACTION: Record<string, string> = {
  /**
   * * HOP_DONG - XET DUYET
   */
  XET_DUYET_CHO_PHE_DUYET: 'Chờ phê duyệt',
  XET_DUYET_PHE_DUYET: 'Phê duyệt',
  XET_DUYET_TU_CHOI: 'Từ chối',
  XET_DUYET_GUI_LAI: 'Gửi lại',
  DAM_PHAN_GIAO_VIEC: 'Giao việc',
  DAM_PHAN_GUI_NOI_DUNG_DAM_PHAN: 'Gửi nội dung đàm phán',
  DAM_PHAN_TU_CHOI: 'Đàm phán từ chối',
  DAM_PHAN_PHE_DUYET: 'Đàm phán phê duyệt',
};

export const LABEL_COLORS_ACTION: Record<string, string> = {
  XET_DUYET_CHO_PHE_DUYET: 'default',
  XET_DUYET_PHE_DUYET: 'success',
  XET_DUYET_TU_CHOI: 'error',
  XET_DUYET_GUI_LAI: 'secondary',
  DAM_PHAN_GIAO_VIEC: 'default',
  DAM_PHAN_PHE_DUYET: 'success',
  DAM_PHAN_TU_CHOI: 'error',
  DAM_PHAN_GUI_NOI_DUNG_DAM_PHAN: 'secondary',
};
