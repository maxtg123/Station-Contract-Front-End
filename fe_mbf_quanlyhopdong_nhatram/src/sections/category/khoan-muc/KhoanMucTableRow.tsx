import { LoadingButton } from '@mui/lab';
import { TableCell, TableRow } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { IDmKhoanMuc } from 'src/@types/category';
import ConfirmDialog from 'src/components/confirm-dialog/ConfirmDialog';
import { STATUS_CODE_DELETE_ERROR_DANHMUC } from 'src/constants/danhmuc.constant';
import { useDeleteDmKhoanMucMutation } from 'src/data/dmKhoanMuc';
import { fDate } from 'src/utils/formatTime';
import CellAction from '../components/cell-action';
import MenuActionOnRowDanhMuc from '../components/menu-action-on-row';
import { log } from 'console';

// ----------------------------------------------------------------------

type Props = {
  row: IDmKhoanMuc;
  selected: boolean;
  onEditRow: VoidFunction;
  onSelectRow?: VoidFunction;
  no: number;
};
export default function KhoanMucTableRow({
  no,
  row,
  selected,
  onEditRow,
  onSelectRow,
}: Props) {
  const { ten, ma, ghiChu, createdAt } = row;

  const [openConfirm, setOpenConfirm] = useState(false);

  const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);

  const { mutate: deleteKhoanMuc, isLoading: deleting } =
    useDeleteDmKhoanMucMutation();

  const { enqueueSnackbar } = useSnackbar();

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

  const handleDelete = () => {
    if (row.id) {
      deleteKhoanMuc(
        { id: row.id.toString() },
        {
          onSuccess: (data) => {
            enqueueSnackbar(`${data} khoản mục "${row.ten}"`, {
              variant: 'success',
            });
            handleCloseConfirm();
          },
          onError: () => {
            enqueueSnackbar(`Có lỗi trong quá trình xoá khoản mục`, {
              variant: 'error',
            });
            handleCloseConfirm();
          },
        }
      );
    }
  };

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell align="left">{no}</TableCell>
        <TableCell>{ten}</TableCell>

        <TableCell align="left">{ma}</TableCell>

        <TableCell align="left">{ghiChu}</TableCell>

        <TableCell align="center">{fDate(new Date(createdAt))}</TableCell>

        <TableCell align="right">
          <CellAction openPopover={openPopover} onClick={handleOpenPopover} />
        </TableCell>
      </TableRow>

      <MenuActionOnRowDanhMuc
        openPopover={openPopover}
        onDelete={() => {
          handleOpenConfirm();
          handleClosePopover();
        }}
        onEdit={() => {
          onEditRow();
          handleClosePopover();
        }}
        onClosePopover={handleClosePopover}
      />

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Xóa"
        content="Bạn có chắc chắn muốn xóa?"
        action={
          <LoadingButton
            variant="contained"
            type="button"
            color="error"
            loading={deleting}
            onClick={handleDelete}
          >
            Xóa
          </LoadingButton>
        }
      />
    </>
  );
}
