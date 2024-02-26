// @mui
import {
  Autocomplete,
  Box,
  Button,
  IconButton,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { useEffect, useState } from 'react';
import { OptionTypeTram } from 'src/@types/common';
import Iconify from 'src/components/iconify/Iconify';
import MenuPopover from 'src/components/menu-popover/MenuPopover';
import { useHopDongFilterContext } from 'src/context/hop-dong-mat-bang/hopDongFilterContext';
import useAuthCredentials from 'src/hooks/useAuthCredentials';
// components

// ----------------------------------------------------------------------

type Props = {
  filterName: string;
  onDragColumnTable?: VoidFunction;
  onFilterAdvanced?: VoidFunction;
  isNotFound?: boolean;
  onExport?: VoidFunction;
  onSyncFile?: VoidFunction;
  onSyncPhuLuc?: VoidFunction;
  onSynsHopDongThuHuong?: VoidFunction;
  type: 'active' | 'draft';
  module?: 'GIAO_VIEC' | 'HOP_DONG' | 'THANH_TOAN';
  onFilterName: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const TINH_TRANG_THANH_TOAN: OptionTypeTram[] = [
  { id: 'CAN_THANH_TOAN', ten: 'Cần thanh toán' },
  { id: 'QUA_HAN', ten: 'Quá hạn thanh toán' },
];

export default function HopDongTableToolbar({
  filterName,
  onFilterName,
  onDragColumnTable,
  onFilterAdvanced,
  onExport,
  onSyncFile,
  onSyncPhuLuc,
  onSynsHopDongThuHuong,
  isNotFound,
  type,
  module,
}: Props) {
  const {
    state: { filterFormFields },
    dispatch,
  } = useHopDongFilterContext();
  const { isAdmin } = useAuthCredentials();
  const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);
  const [search, setSearch] = useState<string>('');
  const handleFilterName = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFilterName(event);
    setSearch(event.target.value);
  };
  useEffect(() => {
    setSearch(filterName);
  }, [filterName]);
  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

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
        sx={{ px: 2.5, py: 3 }}
      >
        <Box sx={{ flexBasis: '50%' }}>
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
          {isAdmin && type === 'draft' && (
            <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          )}
          <MenuPopover
            open={openPopover}
            onClose={handleClosePopover}
            arrow="right-top"
            sx={{ minWidth: 140 }}
          >
            {/* <MenuItem>
            {onSyncFile && (
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
          </MenuItem> */}
            {onSyncPhuLuc && (
              <MenuItem
                onClick={() => {
                  onSyncPhuLuc();
                  handleClosePopover();
                }}
              >
                <Iconify icon="ic:baseline-sync-lock" />
                <Tooltip title="Đồng bộ phụ lục hiệu lực từ chương trình cũ">
                  <Typography>Đồng bộ phụ lục</Typography>
                </Tooltip>
              </MenuItem>
            )}
            {onSynsHopDongThuHuong && (
              <MenuItem
                onClick={() => {
                  onSynsHopDongThuHuong();
                  handleClosePopover();
                }}
              >
                <Iconify icon="ic:outline-sync" />
                <Tooltip title="Đồng bộ hợp đồng thụ hưởng từ chương trình cũ">
                  <Typography>Đồng bộ hợp đồng thụ hưởng</Typography>
                </Tooltip>
              </MenuItem>
            )}
          </MenuPopover>
        </Stack>
      </Stack>
      {type === 'active' && module === 'HOP_DONG' && (
        <Stack
          spacing={2}
          alignItems="center"
          direction={{
            xs: 'column',
            sm: 'row',
          }}
          sx={{ px: 2.5, pb: 3 }}
        >
          <Autocomplete
            sx={{ minWidth: '258px' }}
            options={TINH_TRANG_THANH_TOAN}
            value={filterFormFields.tinhTrangThanhToan}
            getOptionLabel={(option: OptionTypeTram | string) => (option as OptionTypeTram).ten}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={(e, newValue) => {
              dispatch({
                type: 'set-form-filter',
                payload: { ...filterFormFields, tinhTrangThanhToan: newValue },
              });
            }}
            renderInput={(params) => <TextField {...params} label="Tình trạng thanh toán" />}
            renderOption={(props, option) => (
              <li {...props} key={option.id}>
                {option.ten}
              </li>
            )}
          />
          {/* <TinhTrangThanhToanField
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
          /> */}
          {/* <DatePicker
            value={filterFormFields.kyThanhToanFrom}
            label="Kỳ thanh toán từ ngày"
            onChange={(newValue) => {
              dispatch({
                type: 'set-form-filter',
                payload: { ...filterFormFields, kyThanhToanFrom: newValue },
              });
            }}
            sx={{ minWidth: '230px' }}
          /> */}
          <DatePicker
            value={filterFormFields.kyThanhToanTo}
            label="Kỳ thanh toán đến ngày"
            onChange={(newValue) => {
              dispatch({
                type: 'set-form-filter',
                payload: { ...filterFormFields, kyThanhToanTo: newValue },
              });
            }}
            sx={{ minWidth: '230px' }}
          />
        </Stack>
      )}
    </>
  );
}
