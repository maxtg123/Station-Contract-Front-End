import { LoadingButton } from '@mui/lab';
import { TableCell, TableRow } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { IDmLoaiHDPhuTro } from 'src/@types/category';
import ConfirmDialog from 'src/components/confirm-dialog/ConfirmDialog';
import { STATUS_CODE_DELETE_ERROR_DANHMUC } from 'src/constants/danhmuc.constant';
import { useDeleteDmLoaiHDPhuTroMutation } from 'src/data/dmLoaiHDPhuTro';
import { fCurrencyVND } from 'src/utils/formatNumber';
import { fDate } from 'src/utils/formatTime';
import CellAction from '../components/cell-action';
import MenuActionOnRowDanhMuc from '../components/menu-action-on-row';

// ----------------------------------------------------------------------

type Props = {
  row: IDmLoaiHDPhuTro;
  selected: boolean;
  onEditRow: VoidFunction;
  onSelectRow?: VoidFunction;
  no: number;
};

export default function LoaiHDPhuTroTableRow({ no, row, selected, onEditRow, onSelectRow }: Props) {
  const { ma, ten, gia, ghiChu, createdAt } = row;

  const [openConfirm, setOpenConfirm] = useState(false);

  const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);

  const { mutate: deleteLoaiHDPhuTro, isLoading: deleting } = useDeleteDmLoaiHDPhuTroMutation();

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
      deleteLoaiHDPhuTro(
        { id: row.id.toString() },
        {
          onSuccess: (data) => {
            if (data.status.code === STATUS_CODE_DELETE_ERROR_DANHMUC) {
              enqueueSnackbar(
                `Danh mục thuê phụ trợ "${row.ten}" đang được sử dụng nên không thể xóa. Vui lòng kiểm tra dữ liệu`,
                {
                  variant: 'error',
                }
              );
            } else {
              enqueueSnackbar(`Xoá thuê phụ trợ "${row.ten}" thành công`, {
                variant: 'success',
              });
            }
            handleCloseConfirm();
          },
          onError: () => {
            enqueueSnackbar(`Có lỗi trong quá trình xoá thuê phụ trợ`, {
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
        <TableCell align="left">{ten}</TableCell>
        <TableCell align="left">{fCurrencyVND(gia)}</TableCell>
        <TableCell align="left">{ghiChu || ''}</TableCell>
        <TableCell>{ma}</TableCell>
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
        title={`Xóa danh mục thuê phụ trợ ${ten}`}
        content="Bạn có chắc chắn muốn xóa danh mục thuê phụ trợ này?"
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
