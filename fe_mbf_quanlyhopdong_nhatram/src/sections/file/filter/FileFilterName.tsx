// @mui
import { TextField, InputAdornment } from '@mui/material';
import Iconify from 'src/components/iconify/Iconify';
// components

// ----------------------------------------------------------------------

type Props = {
  filterName: string;
  onFilterName: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function FileFilterName({ filterName, onFilterName }: Props) {
  return (
    <TextField
      size="small"
      value={filterName}
      onChange={onFilterName}
      placeholder="Tìm kiếm..."
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
          </InputAdornment>
        ),
      }}
    />
  );
}
