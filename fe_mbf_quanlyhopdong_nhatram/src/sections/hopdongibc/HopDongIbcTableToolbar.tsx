// @mui
import { Box, Button, InputAdornment, Stack, TextField, Tooltip } from '@mui/material';
import { useEffect, useState } from 'react';
import Iconify from 'src/components/iconify/Iconify';
import useAuthCredentials from 'src/hooks/useAuthCredentials';
// components

// ----------------------------------------------------------------------

type Props = {
  filterName: string;
  isFiltered: boolean;
  onResetFilter: VoidFunction;
  onDragColumnTable?: VoidFunction;
  onFilterAdvanced?: VoidFunction;
  onSyncFile?: VoidFunction;
  onSyncPhuLuc?: VoidFunction;
  onFilterName: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function HopDongIbcTableToolbar({
  filterName,
  isFiltered,
  onFilterName,
  onDragColumnTable,
  onFilterAdvanced,
  onResetFilter,
  onSyncFile,
  onSyncPhuLuc,
}: Props) {
  const { isAdmin } = useAuthCredentials();
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
      sx={{ px: 2.5, py: 3 }}
    >
      <Box sx={{ flexBasis: `${isFiltered ? '50%' : '60%'}` }}>
        <TextField
          fullWidth
          value={search}
          onChange={handleFilterName}
          placeholder="Tìm kiếm số hợp đồng, số hợp đồng Erp, mã trạm, mã trạm Erp, mã ĐTXD"
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
        {onDragColumnTable && (
          <Button
            disableRipple
            color="inherit"
            startIcon={<Iconify icon="material-symbols:view-column" />}
            onClick={onDragColumnTable}
          >
            Cột hiển thị
          </Button>
        )}
        {onFilterAdvanced && (
          <Button
            disableRipple
            color="inherit"
            startIcon={<Iconify icon="ic:round-filter-list" />}
            onClick={onFilterAdvanced}
          >
            Lọc dữ liệu
          </Button>
        )}
        {isAdmin && onSyncFile && (
          <Tooltip title="Đồng bộ file từ chương trình cũ">
            <Button
              color="secondary"
              startIcon={<Iconify icon="ic:baseline-cloud-sync" />}
              onClick={onSyncFile}
            >
              Đồng bộ file
            </Button>
          </Tooltip>
        )}
        {isAdmin && onSyncPhuLuc && (
          <Tooltip title="Đồng bộ phụ lục hiệu lực từ chương trình cũ">
            <Button
              startIcon={<Iconify icon="ic:baseline-sync-lock" />}
              color="primary"
              onClick={onSyncPhuLuc}
            >
              Đồng bộ phụ lục
            </Button>
          </Tooltip>
        )}
      </Stack>
    </Stack>
  );
}
