/* eslint-disable react-hooks/exhaustive-deps */
import { LoadingButton } from '@mui/lab';
import { Collapse, IconButton, Paper, TableCell, TableRow, Typography } from '@mui/material';
import equal from 'fast-deep-equal';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { IDmPhongDai, IDmTo } from 'src/@types/category';
import ConfirmDialog from 'src/components/confirm-dialog/ConfirmDialog';
import Iconify from 'src/components/iconify/Iconify';
import { STATUS_CODE_DELETE_ERROR_DANHMUC } from 'src/constants/danhmuc.constant';
import { useDeleteDmPhongDaiMutation } from 'src/data/dmPhongDai';
import { useDmTosQuery } from 'src/data/dmTo';
import { fDate } from 'src/utils/formatTime';
import CellAction from '../components/cell-action';
import MenuActionOnRowDanhMuc from '../components/menu-action-on-row';
import ListTo from './to/ListTo';

// ----------------------------------------------------------------------

type Props = {
  row: IDmPhongDai;
  selected: boolean;
  onEditRow: VoidFunction;
  onSelectRow?: VoidFunction;
  no: number;
};

export default function PhongDaiTableRow({ no, row, selected, onEditRow, onSelectRow }: Props) {
  const { id, ten, tenVietTat, maDataSite, loai, ghiChu, createdAt } = row;

  const [openConfirm, setOpenConfirm] = useState(false);

  const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);

  const [dataTo, setDataTo] = useState<IDmTo[]>([]);

  const { data: listDataTo } = useDmTosQuery({ refetchOnWindowFocus: false });

  const [open, setOpen] = useState(false);

  const { mutate: deletePhongDai, isLoading: deleting } = useDeleteDmPhongDaiMutation();

  const { enqueueSnackbar } = useSnackbar();

  const [prevDataTo, setPrevDataTo] = useState<IDmTo[]>([]);
  useEffect(() => {
    console.log('floop');
    if (id && listDataTo && listDataTo.elements.length > 0) {
      const filterTo = listDataTo.elements.filter(
        (item) => item.phongDai.id.toString() === id.toString()
      );
      if (!equal(filterTo, prevDataTo)) {
        setDataTo(filterTo);
        setPrevDataTo(filterTo);
      }
    }
  }, [id, listDataTo, prevDataTo]);

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
      deletePhongDai(
        { id: row.id.toString() },
        {
          onSuccess: (data) => {
            if (data.status.code === STATUS_CODE_DELETE_ERROR_DANHMUC) {
              enqueueSnackbar(
                `Danh mục phòng đài "${row.ten}" đang được sử dụng nên không thể xóa. Vui lòng kiểm tra dữ liệu`,
                {
                  variant: 'error',
                }
              );
            } else {
              enqueueSnackbar(`Xoá Phòng đài "${row.ten}" thành công`, {
                variant: 'success',
              });
            }
            handleCloseConfirm();
          },
          onError: () => {
            enqueueSnackbar(`Có lỗi trong quá trình xoá Phòng đài`, {
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
        <TableCell>{ten}</TableCell>
        <TableCell align="left">{tenVietTat}</TableCell>
        <TableCell align="left">{maDataSite}</TableCell>
        <TableCell align="left">{loai}</TableCell>

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
                Tổ viễn thông
              </Typography>
              <ListTo data={dataTo} />
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
