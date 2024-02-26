import { IPhanQuyen } from 'src/@types/chucvu';

export const PHAN_QUYEN: IPhanQuyen[] = [
  {
    key: 'NGUOI_DUNG',
    label: 'Quản lý người dùng',
    child: [
      { label: 'Xem', checked: true, key: 'XEM' },
      { label: 'Thêm mới', checked: true, key: 'THEM_MOI' },
      { label: 'Cập nhật', checked: true, key: 'CAP_NHAT' },
    ],
  },
  {
    key: 'CHUC_VU',
    label: 'Quản lý chức vụ',
    child: [
      { label: 'Xem', checked: true, key: 'XEM' },
      { label: 'Thêm mới', checked: true, key: 'THEM_MOI' },
      { label: 'Cập nhật', checked: true, key: 'CAP_NHAT' },
    ],
  },
  {
    key: 'DANH_MUC',
    label: 'Danh mục',
    child: [
      { label: 'Xem', checked: true, key: 'XEM' },
      { label: 'Thêm mới', checked: true, key: 'THEM_MOI' },
      { label: 'Cập nhật', checked: true, key: 'CAP_NHAT' },
    ],
  },
  {
    key: 'TRAM',
    label: 'Trạm',
    child: [
      { label: 'Xem', checked: true, key: 'XEM' },
      { label: 'Thêm mới', checked: true, key: 'THEM_MOI' },
      { label: 'Cập nhật', checked: true, key: 'CAP_NHAT' },
      { label: 'Import', checked: true, key: 'IMPORT' },
    ],
  },
  {
    key: 'HOP_DONG',
    label: 'Hợp đồng',
    child: [
      { label: 'Xem', checked: true, key: 'XEM' },
      { label: 'Thêm mới', checked: true, key: 'THEM_MOI' },
      { label: 'Cập nhật', checked: true, key: 'CAP_NHAT' },
      { label: 'Import', checked: true, key: 'IMPORT' },
      { label: 'Xét duyệt', checked: true, key: 'XET_DUYET' },
    ],
  },
  { key: 'BAO_CAO', label: 'Báo cáo', child: [{ label: 'Xem', checked: true, key: 'XEM' }] },
  {
    key: 'DAM_PHAN',
    label: 'Đàm phán',
    child: [
      { label: 'Giao việc', checked: true, key: 'GIAO_VIEC' },
      { label: 'Nhận việc', checked: true, key: 'NHAN_VIEC' },
    ],
  },
];

const array: string[] = [];
PHAN_QUYEN.forEach((item) => {
  item.child.forEach((itemChild) => {
    array.push(`${item.key}:${itemChild.key}`);
  });
});

export const listKeyChecked = array;
