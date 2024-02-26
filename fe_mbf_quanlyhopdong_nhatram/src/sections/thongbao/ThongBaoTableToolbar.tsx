import { Button, MenuItem, Stack, TextField } from '@mui/material';
import Iconify from 'src/components/iconify/Iconify';
import { LABELS_MAP_MODULE, LABELS_MAP_STATUS } from 'src/constants/thongbao.constant';

// ----------------------------------------------------------------------

const optionsStatus = ['CHUA_XEM', 'XEM'];
const optionsModule = ['HOP_DONG', 'TRAM', 'THANH_TOAN', 'DAM_PHAN'];

type Props = {
  isFiltered: boolean;
  onResetFilter: VoidFunction;
  filterStatus: string;
  filterModule: string;
  onFilterModule: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFilterStatus: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function ThongBaoTableToolbar({
  isFiltered,
  filterStatus,
  filterModule,
  onFilterModule,
  onFilterStatus,
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
        select
        label="Trạng thái"
        value={filterStatus}
        onChange={onFilterStatus}
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
          maxWidth: { sm: 240 },
          textTransform: 'capitalize',
        }}
      >
        {optionsStatus.map((option) => (
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
            {LABELS_MAP_STATUS[option] || option}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        fullWidth
        select
        label="Modules"
        value={filterModule}
        onChange={onFilterModule}
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
          maxWidth: { sm: 240 },
          textTransform: 'capitalize',
        }}
      >
        {optionsModule.map((option) => (
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
            {LABELS_MAP_MODULE[option] || option}
          </MenuItem>
        ))}
      </TextField>
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
