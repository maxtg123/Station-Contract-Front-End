import { Button, MenuItem, TextField } from '@mui/material';
import Iconify from 'src/components/iconify/Iconify';
import { LABELS_MAP_MODULE } from 'src/constants/activityLog.constant';

// ----------------------------------------------------------------------

const optionsModule = ['TRAM', 'DANH_MUC'];

type Props = {
  isFiltered: boolean;
  onResetFilter: VoidFunction;
  filterModule: string;
  onFilterModule: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function ActivityLogTableToolbar({
  isFiltered,
  filterModule,
  onFilterModule,
  onResetFilter,
}: Props) {
  return (
    <>
      <TextField
        fullWidth
        select
        label="Modules"
        value={filterModule}
        onChange={onFilterModule}
        size="small"
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
    </>
  );
}
