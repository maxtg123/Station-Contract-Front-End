import { LoadingButton } from '@mui/lab';
import { Collapse, IconButton, Paper, TableCell, TableRow, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { IDmHuyen } from 'src/@types/category';
import ConfirmDialog from 'src/components/confirm-dialog/ConfirmDialog';
import Iconify from 'src/components/iconify/Iconify';
import { STATUS_CODE_DELETE_ERROR_DANHMUC } from 'src/constants/danhmuc.constant';
import { useDeleteDmHuyenMutation } from 'src/data/dmHuyen';
import { fDate } from 'src/utils/formatTime';
import CellAction from '../../components/cell-action';
import MenuActionOnRowDanhMuc from '../../components/menu-action-on-row';
import PhuongXa from '../phuong-xa/PhuongXa';

// ----------------------------------------------------------------------

type Props = {
  row: IDmHuyen;
  selected: boolean;
  onEditRow: VoidFunction;
  onSelectRow?: VoidFunction;
  no: number;
};

export default function HuyenQuanTableRow({ no, row, selected, onEditRow, onSelectRow }: Props) {
  const { ma, ten, ghiChu, createdAt, id } = row;

  const [open, setOpen] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);

  const { mutate: deleteHuyen, isLoading: deleting } = useDeleteDmHuyenMutation();

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
      deleteHuyen(
        { id: row.id.toString() },
        {
          onSuccess: (data) => {
            if (data.status.code === STATUS_CODE_DELETE_ERROR_DANHMUC) {
              enqueueSnackbar(
                `Danh mục huyện "${row.ten}" đang được sử dụng nên không thể xóa. Vui lòng kiểm tra dữ liệu`,
                {
                  variant: 'error',
                }
              );
            } else {
              enqueueSnackbar(`Xoá Huyện "${row.ten}" thành công`, {
                variant: 'warning',
              });
            }
            handleCloseConfirm();
          },
          onError: () => {
            enqueueSnackbar(`Có lỗi trong quá trình xoá Huyện`, {
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
        <TableCell>
          <IconButton
            size="small"
            color={open ? 'inherit' : 'default'}
            onClick={() => setOpen(!open)}
          >
            <Iconify icon={open ? 'eva:minus-fill' : 'eva:plus-fill'} />
          </IconButton>
        </TableCell>
        <TableCell>{ma}</TableCell>

        <TableCell align="left">{ten}</TableCell>

        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          {ghiChu}
        </TableCell>

        <TableCell align="center">{fDate(new Date(createdAt))}</TableCell>

        <TableCell align="right">
          <CellAction openPopover={openPopover} onClick={handleOpenPopover} />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell sx={{ py: 1 }} colSpan={12}>
          <Collapse in={open} unmountOnExit>
            <Paper
              variant="outlined"
              sx={{
                pt: 2,
                borderRadius: 1.5,
                ...(open && {
                  boxShadow: (theme) => theme.customShadows.z20,
                }),
              }}
            >
              <Typography variant="h6" sx={{ m: 2, mt: 0 }}>
                Phường / Xã
              </Typography>

              <PhuongXa id={id} />
            </Paper>
          </Collapse>
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
