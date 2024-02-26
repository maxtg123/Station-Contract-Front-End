import { LoadingButton } from '@mui/lab';
import { TableCell, TableRow } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { IDmHinhThucKyHopDong } from 'src/@types/category';
import ConfirmDialog from 'src/components/confirm-dialog/ConfirmDialog';
import { STATUS_CODE_DELETE_ERROR_DANHMUC } from 'src/constants/danhmuc.constant';
import { useDeleteDmHinhThucKyHopDongMutation } from 'src/data/dmHinhThucKyHopDong';
import { fDate } from 'src/utils/formatTime';
import CellAction from '../components/cell-action';
import MenuActionOnRowDanhMuc from '../components/menu-action-on-row';

// ----------------------------------------------------------------------

type Props = {
  row: IDmHinhThucKyHopDong;
  selected: boolean;
  onEditRow: VoidFunction;
  onSelectRow?: VoidFunction;
  no: number;
};

export default function HinhThucKyHopDongTableRow({
  no,
  row,
  selected,
  onEditRow,
  onSelectRow,
}: Props) {
  const { ten, ma, ghiChu, createdAt } = row;

  const [openConfirm, setOpenConfirm] = useState(false);

  const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);

  const { mutate: deleteHinhThucKyHopDong, isLoading: deleting } =
    useDeleteDmHinhThucKyHopDongMutation();

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
      deleteHinhThucKyHopDong(
        { id: row.id.toString() },
        {
          onSuccess: (data) => {
            if (data.status.code === STATUS_CODE_DELETE_ERROR_DANHMUC) {
              enqueueSnackbar(
                `Danh mục hình thức ký hợp đồng "${row.ten}" đang được sử dụng nên không thể xóa. Vui lòng kiểm tra dữ liệu`,
                {
                  variant: 'error',
                }
              );
            } else {
              enqueueSnackbar(`Xoá hình thức ký hợp đồng "${row.ten}" thành công`, {
                variant: 'success',
              });
            }

            handleCloseConfirm();
          },
          onError: () => {
            enqueueSnackbar(`Có lỗi trong quá trình xoá hình thức ký hợp đồng`, {
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

        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          {ghiChu}
        </TableCell>

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
