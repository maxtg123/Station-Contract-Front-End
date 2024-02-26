import { Box, Button, InputAdornment, Stack, TextField } from '@mui/material';
import Iconify from 'src/components/iconify/Iconify';

type Props = {
  isFiltered: boolean;
  onResetFilter: VoidFunction;
  filterName: string;
  onFilterName: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const DaDuocGiaoViecTableToolbar = ({
  isFiltered,
  onFilterName,
  onResetFilter,
  filterName,
}: Props) => (
  <Stack
    spacing={2}
    alignItems="center"
    direction={{
      xs: 'column',
      sm: 'row',
    }}
    sx={{ px: 2.5, py: 3 }}
  >
    <Box sx={{ flexBasis: '65%' }}>
      <TextField
        fullWidth
        value={filterName}
        onChange={onFilterName}
        placeholder="Tìm kiếm số hợp đồng, số hợp đồng Erp, mã trạm, mã trạm Erp"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
        }}
      />
    </Box>

    <Stack direction="row" flex={1} spacing={2}>
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
  </Stack>
);

export default DaDuocGiaoViecTableToolbar;
