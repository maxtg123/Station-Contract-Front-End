import { MenuItem, TextField } from '@mui/material';
import React from 'react';

type Props = {
  value: string | null;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};
const LABELS_MAP: Record<string, string> = {
  CAN_THANH_TOAN: 'Cần thanh toán',
  QUA_HAN: 'Quá hạn thanh toán',
  TAT_CA: 'Tất cả',
};
const OPTIONS_TRANG_THAI_THANH_TOAN = ['TAT_CA', 'CAN_THANH_TOAN', 'QUA_HAN'];
export default function TinhTrangThanhToanField({ value, onChange }: Props) {
  return (
    <TextField
      select
      label="Tình trạng thanh toán"
      value={value}
      onChange={onChange}
      SelectProps={{
        MenuProps: {
          PaperProps: {
            sx: {
              maxHeight: 260,
            },
          },
        },
      }}
      sx={{
        minWidth: { md: 240 },
        textTransform: 'inherit',
      }}
    >
      {OPTIONS_TRANG_THAI_THANH_TOAN.map((option) => (
        <MenuItem
          key={option}
          value={option}
          sx={{
            mx: 1,
            borderRadius: 0.75,
            typography: 'body2',
            textTransform: 'capitalize',
          }}
        >
          {LABELS_MAP[option] || option}
        </MenuItem>
      ))}
    </TextField>
  );
}
