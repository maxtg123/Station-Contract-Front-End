import LoadingButton from '@mui/lab/LoadingButton';
import { Button, InputAdornment, MenuItem, Stack, TextField } from '@mui/material';
import { useState } from 'react';
import ConfirmDialog from 'src/components/confirm-dialog/ConfirmDialog';
import Iconify from 'src/components/iconify/Iconify';
import MenuPopover from 'src/components/menu-popover/MenuPopover';

// ----------------------------------------------------------------------

type Props = {
  isFiltered: boolean;
  onResetFilter: VoidFunction;
  onFilterName: (event: React.ChangeEvent<HTMLInputElement>) => void;
  countRow: number;
  onSaveChangesThanhToan: VoidFunction;
  onExportThanhToanChiHo: VoidFunction;
  onExportBangKeKhaiThanhToan: VoidFunction;
  isLoadingExportBangKeKhaiThanhToan: boolean;
  isLoadingUpdatingThanhToan: boolean;
  isLoadingExportingThanhToan: boolean;
};
const WIDTH_MENU_POPOVER = 250;
export default function TienHanhThanhToanTableToolbar({
  isFiltered,
  onResetFilter,
  onFilterName,
  countRow,
  onSaveChangesThanhToan,
  onExportThanhToanChiHo,
  isLoadingUpdatingThanhToan,
  isLoadingExportingThanhToan,
  onExportBangKeKhaiThanhToan,
  isLoadingExportBangKeKhaiThanhToan,
}: Props) {
  const [search, setSearch] = useState<string>('');
  const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };
  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setOpenPopover(event.currentTarget);
  };
  const handleClosePopover = () => {
    setOpenPopover(null);
  };
  const handleFilterName = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFilterName(event);
    setSearch(event.target.value);
  };

  const handleResetFilter = () => {
    onResetFilter();
    setSearch('');
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
        sx={{ px: 2.5, py: 3 }}
      >
        <TextField
          // fullWidth
          value={search}
          onChange={handleFilterName}
          placeholder="Tìm kiếm số hợp đồng, số hợp đồng Erp, mã trạm, mã trạm Erp"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
        <LoadingButton
          sx={{ minWidth: '200px' }}
          variant="contained"
          endIcon={<Iconify icon="eva:more-vertical-fill" />}
          onClick={handleOpenPopover}
          loading={isLoadingExportingThanhToan}
        >
          Xuất thanh toán
        </LoadingButton>
        <LoadingButton
          sx={{ width: '240px' }}
          variant="contained"
          endIcon={<Iconify icon="eva:credit-card-outline" />}
          onClick={handleOpenConfirm}
          loading={isLoadingUpdatingThanhToan}
        >
          Tiến hành thanh toán
        </LoadingButton>
        {isFiltered && (
          <Button
            color="error"
            sx={{ flexShrink: 0 }}
            onClick={handleResetFilter}
            startIcon={<Iconify icon="eva:refresh-outline" />}
          >
            Làm mới
          </Button>
        )}
      </Stack>
      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="top-right"
        sx={{ width: WIDTH_MENU_POPOVER, marginTop: '10px' }}
      >
        <MenuItem
          onClick={() => {
            onExportThanhToanChiHo();
            handleClosePopover();
          }}
        >
          Xuất thanh toán chi hộ
        </MenuItem>
        <MenuItem
          onClick={() => {
            onExportBangKeKhaiThanhToan();
            handleClosePopover();
          }}
        >
          Xuất bảng kê khai thanh toán
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClosePopover();
          }}
        >
          Xuất thanh toán web chi phí
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClosePopover();
          }}
        >
          Xuất hợp đồng theo ERP
        </MenuItem>
      </MenuPopover>
      {openConfirm && (
        <ConfirmDialog
          open={openConfirm}
          onClose={handleCloseConfirm}
          title="Thanh toán"
          content={
            <>
              Bạn có chắc chắn thanh toán <strong> {countRow} </strong> hợp đồng?
            </>
          }
          action={
            <LoadingButton
              variant="contained"
              color="error"
              loading={isLoadingUpdatingThanhToan || isLoadingExportBangKeKhaiThanhToan}
              onClick={() => {
                onSaveChangesThanhToan();
                handleCloseConfirm();
              }}
            >
              Đồng ý
            </LoadingButton>
          }
        />
      )}
    </>
  );
}
