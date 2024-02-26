import { LoadingButton } from '@mui/lab';
import {
  Checkbox,
  Chip,
  Collapse,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
import get from 'lodash/get';
import isNil from 'lodash/isNil';
import sortBy from 'lodash/sortBy';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { IDmLoaiThietBiRan } from 'src/@types/category';
import { IHead } from 'src/@types/common';
import { ITram } from 'src/@types/tram';
import ConfirmDialog from 'src/components/confirm-dialog/ConfirmDialog';
import Iconify from 'src/components/iconify/Iconify';
import Label from 'src/components/label/Label';
import MenuPopover from 'src/components/menu-popover/MenuPopover';
import PermissionWrapper from 'src/components/permission-wrapper';
import { useDeleteTramMutation } from 'src/data/tram';
import { fDate } from 'src/utils/formatTime';
import ListHopDongTrongTram from '../components/tram/hop-dong-in-tram/ListHopDongTrongTram';

// ----------------------------------------------------------------------

type Props = {
  row: ITram;
  selected: boolean;
  onEditRow: VoidFunction;
  onSelectRow?: VoidFunction;
  headLabel: IHead[];
};

export default function TramTableRow({ row, selected, onEditRow, onSelectRow, headLabel }: Props) {
  const [openConfirm, setOpenConfirm] = useState(false);

  const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);

  const [open, setOpen] = useState(false);

  const { mutate: deleteTram, isLoading: deleting } = useDeleteTramMutation();

  const { enqueueSnackbar } = useSnackbar();

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
      deleteTram(
        { id: row.id.toString() },
        {
          onSuccess: () => {
            enqueueSnackbar(`Xoá Trạm "${row.ten}" thành công`, {
              variant: 'success',
            });
            handleClosePopover();
          },
          onError: () => {
            enqueueSnackbar(`Có lỗi trong quá trình xoá Trạm`, {
              variant: 'error',
            });
          },
        }
      );
    }
  };

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell
          padding="checkbox"
          style={{
            position: 'sticky',
            left: 0,
            zIndex: 1,
            backgroundColor: 'white',
          }}
        >
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>
        <TableCell>
          <IconButton
            size="small"
            color={open ? 'inherit' : 'default'}
            onClick={() => setOpen(!open)}
          >
            <Iconify icon={open ? 'eva:arrow-ios-downward-fill' : 'eva:arrow-ios-upward-fill'} />
          </IconButton>
        </TableCell>
        {headLabel.map((cell) => {
          let data = get(row, cell.value);
          if (!isNil(cell.type)) {
            switch (cell.type) {
              case 'Date':
                data = fDate(get(row, cell.value));
                break;

              default:
                data = get(row, cell.value);
                break;
            }
          }

          if (!isNil(cell.format)) {
            data = cell.format.replace('#value', data);
          }

          if (cell.id === 'trangThaiHoatDong') {
            const active = data === 'HOAT_DONG';
            return (
              <TableCell align="left" key={cell.id}>
                <Label
                  variant="soft"
                  color={(!active && 'error') || 'success'}
                  sx={{ textTransform: 'capitalize' }}
                >
                  {active ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                </Label>
              </TableCell>
            );
          }
          if (cell.id === 'dmLoaiThietBiRanList') {
            return (
              <TableCell align="center" key={cell.id}>
                <Stack direction="row" flexWrap="wrap" justifyContent="center">
                  {sortBy(data, ['ten']).map((ran: IDmLoaiThietBiRan, i: number) => (
                    <Chip
                      size="small"
                      key={ran.id}
                      label={ran.ten}
                      sx={{ mr: i === data.length - 1 ? 0 : 1, mb: 1, color: 'text.secondary' }}
                    />
                  ))}
                </Stack>
              </TableCell>
            );
          }
          if (cell.id === 'daPhatSong') {
            const check = data;
            return (
              <TableCell align={cell.align || 'left'} key={cell.id}>
                <Iconify
                  icon={check ? 'eva:checkmark-circle-fill' : 'eva:close-circle-outline'}
                  sx={{
                    width: 20,
                    height: 20,
                    color: 'success.main',
                    ...(!check && { color: 'error.main' }),
                  }}
                />
              </TableCell>
            );
          }
          if (cell.id === 'doCaoAngten') {
            const dataDoCaoAngten = row.doCaoAngten === null ? '' : data;
            return (
              <TableCell
                id={cell.id}
                key={cell.id.toString() + cell.label.toString()}
                align={cell?.align || 'left'}
              >
                <Typography component="span" variant="body2">
                  {dataDoCaoAngten}
                </Typography>
              </TableCell>
            );
          }
          return (
            <TableCell
              id={cell.id}
              key={cell.id.toString() + cell.label.toString()}
              align={cell?.align || 'left'}
            >
              {data}
            </TableCell>
          );
        })}
        <PermissionWrapper module="TRAM" action="CAP_NHAT" hideWhenBlocked checkAt="atLeastPD">
          <TableCell
            align="right"
            style={{
              position: 'sticky',
              right: 0,
              zIndex: 1,
              backgroundColor: 'white',
            }}
          >
            <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </TableCell>
        </PermissionWrapper>
      </TableRow>
      <TableRow>
        <TableCell
          sx={{
            py: 0,
            pl: 8,
            bgcolor: '#F4F6F8',
          }}
          colSpan={100}
        >
          <Collapse in={open} unmountOnExit orientation="vertical">
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                borderRadius: 1.5,
                ...(open && {
                  mt: 1,
                  mb: 1,
                }),
              }}
            >
              <ListHopDongTrongTram tramId={row.id} />
            </Paper>
          </Collapse>
        </TableCell>
      </TableRow>
      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            onEditRow();
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:edit-fill" />
          Chỉnh sửa
        </MenuItem>
      </MenuPopover>

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
