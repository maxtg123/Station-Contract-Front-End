// @mui
import { MenuItem, TextField } from '@mui/material';
// components

type Props = {
  filterLoaiUpload: string;
  optionsType: string[];
  onFilterLoaiUpLoad: (event: React.ChangeEvent<HTMLInputElement>) => void;
};
const LABELS_MAP: Record<string, string> = {
  FILE_HOP_DONG: 'Hợp đồng',
  FILE_GIAY_TO_SO_HUU: 'Giấy tờ sử hữu',
  FILE_PHU_LUC: 'Dùng chung',
  FILE_DUNG_CHUNG: 'Phụ Lục',
};
export default function FileFilterLoaiUpLoad({
  optionsType,
  filterLoaiUpload,
  onFilterLoaiUpLoad,
}: Props) {
  return (
    <TextField
      select
      size="small"
      label="Loại Upload"
      value={filterLoaiUpload}
      onChange={onFilterLoaiUpLoad}
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
      {optionsType.map((option) => (
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
