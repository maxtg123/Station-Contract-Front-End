import { Button, InputAdornment, Stack, TextField, Box } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { useState, useEffect } from 'react';
import Iconify from 'src/components/iconify/Iconify';
import { useHopDongFilterContext } from 'src/context/hop-dong-mat-bang/hopDongFilterContext';
import TinhTrangThanhToanField from '../fields/TinhTrangThanhToanField';

// ----------------------------------------------------------------------

type Props = {
  filterName: string;
  filterStartDate: Date | null;
  filterEndDate: Date | null;
  onFilterName: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFilterStartDate: (value: Date | null) => void;
  onFilterEndDate: (value: Date | null) => void;
  onDragColumnTable?: VoidFunction;
  onFilterAdvanced?: VoidFunction;
  isNotFound?: boolean;
  onExport?: VoidFunction;
};

export default function ThanhToanTableToolbar({
  onFilterName,
  filterName,
  filterStartDate,
  filterEndDate,
  onFilterEndDate,
  onFilterStartDate,
  onDragColumnTable,
  onFilterAdvanced,
  onExport,
  isNotFound,
}: Props) {
  const {
    state: { filterFormFields },
    dispatch,
  } = useHopDongFilterContext();
  const [search, setSearch] = useState<string>('');
  const handleFilterName = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFilterName(event);
    setSearch(event.target.value);
  };
  useEffect(() => {
    setSearch(filterName);
  }, [filterName]);

  return (
    <>
      <Stack
        spacing={2}
        alignItems="center"
        direction={{
          xs: 'column',
          sm: 'row',
        }}
        justifyContent="space-between"
        sx={{ px: 2.5, pt: 3, pb: 1 }}
      >
        <Box sx={{ flexBasis: '70%' }}>
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
          <Button
            disableRipple
            color="inherit"
            startIcon={<Iconify icon="eva:download-fill" />}
            onClick={onExport}
            disabled={isNotFound}
          >
            Xuất dữ liệu
          </Button>
        </Stack>
      </Stack>
      <Stack
        spacing={2}
        alignItems="center"
        direction={{
          xs: 'column',
          sm: 'row',
        }}
        sx={{ px: 2.5, pb: 3 }}
      >
        <TinhTrangThanhToanField
          value={filterFormFields.tinhTrangThanhToan}
          onChange={(event) => {
            dispatch({
              type: 'set-form-filter',
              payload: {
                ...filterFormFields,
                tinhTrangThanhToan: event.target.value,
              },
            });
          }}
        />
        <DatePicker
          label="Kỳ thanh toán từ ngày"
          value={filterStartDate}
          onChange={onFilterStartDate}
          sx={{ minWidth: '230px' }}
        />
        <DatePicker
          label="Kỳ thanh toán đến ngày"
          value={filterEndDate}
          onChange={onFilterEndDate}
          sx={{ minWidth: '230px' }}
        />
      </Stack>
    </>
  );
}
