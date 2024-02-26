import { IHead } from 'src/@types/common';

export const TABLE_HEAD_LICH_SU_HD: IHead[] = [
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