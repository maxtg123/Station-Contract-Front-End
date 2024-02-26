import { LoadingButton } from '@mui/lab';
import {
  AvatarGroup,
  Divider,
  IconButton,
  MenuItem,
  TableCell,
  TableRow,
  Tooltip,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { IChucVuRow } from 'src/@types/chucvu';
import ConfirmDialog from 'src/components/confirm-dialog/ConfirmDialog';
import { CustomAvatar } from 'src/components/custom-avatar';
import Iconify from 'src/components/iconify/Iconify';
import Label from 'src/components/label/Label';
import MenuPopover from 'src/components/menu-popover/MenuPopover';
import PermissionWrapper from 'src/components/permission-wrapper';
import { CHUA_SU_DUNG, DANG_SU_DUNG } from 'src/constants';
import { useDeleteChucVuMutation } from 'src/data/chucvu';
import { fDate } from 'src/utils/formatTime';

// ----------------------------------------------------------------------

type Props = {
  row: IChucVuRow;
  onEditRow: VoidFunction;
  no: number;
};

export default function ChucVuTableRow({ no, row, onEditRow }: Props) {
  const { ten, ghichu, createdAt, usedStatus, dmPhongDai, nguoiDungKhuVucList } = row;

  const [openConfirm, setOpenConfirm] = useState(false);

  const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);

  const { mutate: deleteChucVu, isLoading: deleting } = useDeleteChucVuMutation();

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
      deleteChucVu(
        { id: row.id.toString() },
        {
          onSuccess: () => {
            enqueueSnackbar(`Xoá chức vụ "${row.ten}" thành công`, {
              variant: 'warning',
            });
            handleClosePopover();
            handleCloseConfirm();
          },
          onError: () => {
            enqueueSnackbar(`Có lỗi trong quá trình xoá chức vụ`, {
              variant: 'error',
            });
          },
        }
      );
    }
  };

  return (
    <>
      <TableRow hover>
        <TableCell align="left">{no}</TableCell>
        <TableCell key="ten" align="left">
          {ten}
        </TableCell>

        <TableCell key="dmPhongDai" align="left">
          {dmPhongDai.ten}
        </TableCell>

        <TableCell key="ghichu" align="left">
          {ghichu}
        </TableCell>

        <TableCell key="numberOfUser" align={nguoiDungKhuVucList.length === 0 ? 'left' : 'right'}>
          {nguoiDungKhuVucList.length === 0 ? (
            0
          ) : (
            <AvatarGroup
              max={5}
              total={nguoiDungKhuVucList.length}
              sx={{
                '& .MuiAvatarGroup-root': {
                  justifyContent: 'flex-start !important',
                },
                '& .MuiAvatarGroup-avatar': {
                  width: 24,
                  height: 24,
                  '&:first-of-type': {
                    fontSize: 12,
                  },
                },
              }}
            >
              {nguoiDungKhuVucList.map((u) => (
                <Tooltip key={u.nguoiDung.id} title={u.nguoiDung.email}>
                  <CustomAvatar name={u.nguoiDung.email} />
                </Tooltip>
              ))}
            </AvatarGroup>
          )}
        </TableCell>

        <TableCell key="createdAt" align="center">
          {fDate(new Date(createdAt))}
        </TableCell>

        <TableCell key="status" align="center">
          <Label
            variant="soft"
            color={(usedStatus && 'error') || 'success'}
            sx={{ textTransform: 'capitalize' }}
          >
            {usedStatus ? DANG_SU_DUNG : CHUA_SU_DUNG}
          </Label>
        </TableCell>

        <TableCell align="right">
          <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <PermissionWrapper module="CHUC_VU" action="CAP_NHAT" hideWhenBlocked checkAt="pdChinh">
          <MenuItem
            onClick={() => {
              onEditRow();
              handleClosePopover();
            }}
          >
            <Iconify icon="eva:edit-fill" />
            Chỉnh sửa
          </MenuItem>
        </PermissionWrapper>

        {!usedStatus && (
          <>
            <Divider sx={{ borderStyle: 'dashed' }} />
            <MenuItem
              onClick={() => {
                handleOpenConfirm();
                handleClosePopover();
              }}
              sx={{ color: 'error.main' }}
            >
              <Iconify icon="eva:trash-2-outline" />
              Xóa
            </MenuItem>
          </>
        )}
      </MenuPopover>

      {openConfirm && (
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
      )}
    </>
  );
}
