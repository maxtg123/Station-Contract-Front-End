import { Button, InputAdornment, Stack, TextField } from '@mui/material';
import Iconify from 'src/components/iconify/Iconify';
// ----------------------------------------------------------------------

type Props = {
  filterName: string;
  isFiltered: boolean;
  onResetFilter: VoidFunction;
  onFilterName: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function KhuVucTramTableToolbar({
  isFiltered,
  filterName,
  onFilterName,
  onResetFilter,
}: Props) {
  return (
    <Stack
      spacing={2}
      alignItems="center"
      direction={{
        xs: 'column',
        sm: 'row',
      }}
      sx={{ px: 2.5, py: 3 }}
    >
      <TextField
        fullWidth
        value={filterName}
        onChange={onFilterName}
        placeholder="Tìm kiếm ..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
        }}
      />

      {isFiltered && (
        <Button
          color="error"
          sx={{ flexShrink: 0 }}
          onClick={onResetFilter}
          startIcon={<Iconify icon="eva:refresh-outline" />}
        >
          Làm mới
        </Button>
      )}
    </Stack>
  );
}
