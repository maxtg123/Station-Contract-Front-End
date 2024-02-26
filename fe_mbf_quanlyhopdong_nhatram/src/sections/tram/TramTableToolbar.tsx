import { Box, Button, InputAdornment, Stack, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import Iconify from 'src/components/iconify/Iconify';

// ----------------------------------------------------------------------

type Props = {
  filterName: string;
  onDragColumnTable: VoidFunction;
  onFilterAdvanced: VoidFunction;
  onFilterName: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function TramTableToolbar({
  onFilterName,
  onDragColumnTable,
  onFilterAdvanced,
  filterName,
}: Props) {
  const [search, setSearch] = useState<string>(filterName);
  const handleFilterName = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFilterName(event);
    setSearch(event.target.value);
  };
  useEffect(() => {
    setSearch(filterName);
  }, [filterName]);

  return (
    <Stack
      spacing={2}
      alignItems="center"
      direction={{
        xs: 'column',
        sm: 'row',
      }}
      sx={{ px: 2.5, py: 2 }}
    >
      <Box sx={{ flexBasis: '65%' }}>
        <TextField
          fullWidth
          value={search}
          onChange={handleFilterName}
          placeholder="Tìm kiếm mã trạm, mã ĐTXD, mã trạm ERP hoặc tên trạm"
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
        <Button
          disableRipple
          color="inherit"
          startIcon={<Iconify icon="material-symbols:view-column" />}
          onClick={onDragColumnTable}
        >
          Cột hiển thị
        </Button>
        <Button
          disableRipple
          color="inherit"
          startIcon={<Iconify icon="ic:round-filter-list" />}
          onClick={onFilterAdvanced}
        >
          Lọc dữ liệu
        </Button>
      </Stack>
    </Stack>
  );
}
