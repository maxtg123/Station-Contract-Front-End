import { LoadingButton } from '@mui/lab';
import { TableCell, TableRow } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { IDmHinhThucDauTu } from 'src/@types/category';
import ConfirmDialog from 'src/components/confirm-dialog/ConfirmDialog';
import { STATUS_CODE_DELETE_ERROR_DANHMUC } from 'src/constants/danhmuc.constant';
import { useDeleteDmHinhThucDauTuMutation } from 'src/data/dmHinhThucDauTu';
import { fDate } from 'src/utils/formatTime';
import CellAction from '../components/cell-action';
import MenuActionOnRowDanhMuc from '../components/menu-action-on-row';

// ----------------------------------------------------------------------

type Props = {
  row: IDmHinhThucDauTu;
  selected: boolean;
  onEditRow: VoidFunction;
  onSelectRow?: VoidFunction;
  no: number;
};

export default function HinhThucDauTuTableRow({
  no,
  row,
  selected,
  onEditRow,
  onSelectRow,
}: Props) {
  const { ten, ma, ghiChu, createdAt } = row;

  const [openConfirm, setOpenConfirm] = useState(false);

  const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);

  const { mutate: deleteLoaiCsht, isLoading: deleting } = useDeleteDmHinhThucDauTuMutation();

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
      deleteLoaiCsht(
        { id: row.id.toString() },
        {
          onSuccess: (data) => {
            if (data.status.code === STATUS_CODE_DELETE_ERROR_DANHMUC) {
              enqueueSnackbar(
                `Danh mục hình thức đầu tư "${row.ten}" đang được sử dụng nên không thể xóa. Vui lòng kiểm tra dữ liệu`,
                {
                  variant: 'error',
                }
              );
            } else {
              enqueueSnackbar(`Xoá Hình thức đầu tư "${row.ten}" thành công`, {
                variant: 'success',
              });
            }
            handleCloseConfirm();
          },
          onError: () => {
            enqueueSnackbar(`Có lỗi trong quá trình xoá Hình thức đầu tư`, {
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
