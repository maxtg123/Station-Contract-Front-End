import { LoadingButton } from '@mui/lab';
import {
  Chip,
  Divider,
  IconButton,
  Link,
  MenuItem,
  Stack,
  TableCell,
  TableRow,
  Tooltip,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useMemo, useState } from 'react';
import { IChucVuRow } from 'src/@types/chucvu';
import { INguoiDung } from 'src/@types/nguoidung';
import ConfirmDialog from 'src/components/confirm-dialog/ConfirmDialog';
import Iconify from 'src/components/iconify/Iconify';
import Label from 'src/components/label/Label';
import MenuPopover from 'src/components/menu-popover/MenuPopover';
import PermissionWrapper from 'src/components/permission-wrapper';
import { DANG_HOAT_DONG, NGUNG_HOAT_DONG } from 'src/constants';
import { useDeleteNguoiDungMutation, useUpdateNguoiDungMutation } from 'src/data/nguoidung';
import useAuthCredentials from 'src/hooks/useAuthCredentials';
import { getAuthCredentials } from 'src/utils/authUtils';

// ----------------------------------------------------------------------

type Props = {
  row: INguoiDung;
  onEditRow: VoidFunction;
  onXemQuyenChucVu: (chucVu: IChucVuRow | null) => void;
  no: number;
};

export default function NguoiDungTableRow({ no, row, onEditRow, onXemQuyenChucVu }: Props) {
  const { profile } = getAuthCredentials();
  const { hoTen, email, soDienThoai, nguoiDungKhuVucList, trangThai } = row;

  const isYou = useMemo(() => {
    if (profile && profile.email === email) {
      return true;
    }
    return false;
  }, [profile, email]);

  const { isAdmin, pdChinh } = useAuthCredentials();

  const userChucVuChinh = useMemo(() => {
    if (isAdmin) {
      return nguoiDungKhuVucList.find((kv) => kv.loai === 'CHINH')?.chucVu;
    }
    return nguoiDungKhuVucList.find(
      (kv) => kv.loai === 'CHINH' && pdChinh?.dmPhongDai?.id === kv.dmPhongDai?.id
    )?.chucVu;
  }, [nguoiDungKhuVucList, pdChinh, isAdmin]);

  const { mutate: deleteNguoiDung, isLoading } = useDeleteNguoiDungMutation();
  const { mutate: updateNguoiDung, isLoading: updating } = useUpdateNguoiDungMutation();

  const [openConfirm, setOpenConfirm] = useState(false);

  const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);

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

  const _handleLock = () => {
    deleteNguoiDung(
      { id: row.id.toString() },
      {
        onSuccess: () => {
          enqueueSnackbar(`Ngừng hoạt động người dùng "${row.email}" thành công`, {
            variant: 'success',
          });
          handleClosePopover();
          handleCloseConfirm();
        },
        onError: () => {
          enqueueSnackbar(`Có lỗi trong quá trình ngừng hoạt động người dùng`, {
            variant: 'error',
          });
        },
      }
    );
  };
  const _handleUnlock = () => {
    updateNguoiDung(
      { id: row.id.toString(), trangThai: 'HOAT_DONG' },
      {
        onSuccess: () => {
          enqueueSnackbar(`Khôi phục người dùng "${row.email}" thành công`, {
            variant: 'success',
          });
          handleClosePopover();
          handleCloseConfirm();
        },
        onError: () => {
          enqueueSnackbar(`Có lỗi trong quá trình khôi phục người dùng`, {
            variant: 'error',
          });
        },
      }
    );
  };

  const handleDelete = () => {
    if (row.id) {
      if (row.trangThai === 'HOAT_DONG') {
        _handleLock();
      } else {
        _handleUnlock();
      }
    }
  };

  return (
    <>
      <TableRow hover>
        <TableCell align="left">{no}</TableCell>
        <TableCell key="hoTen" align="left">
          <Stack direction="row" alignItems="center" gap="4px">
            {hoTen}
            {isYou && (
              <Label variant="soft" color="success" sx={{ textTransform: 'capitalize' }}>
                Bạn
              </Label>
            )}
          </Stack>
        </TableCell>

        <TableCell key="email" align="left">
          {email}
        </TableCell>

        <TableCell key="chucVu" align="left">
          <Link
            href="#"
            variant="subtitle2"
            onClick={() => onXemQuyenChucVu(userChucVuChinh || null)}
          >
            {userChucVuChinh?.ten || ''}
          </Link>
        </TableCell>

        <TableCell key="soDienThoai" align="left">
          {soDienThoai}
        </TableCell>

        <TableCell key="khuVucKhac" align="center">
          <Stack direction="row" flexWrap="wrap" justifyContent="center" gap="4px">
            {nguoiDungKhuVucList
              .filter((kv) => kv.loai === 'KHU_VUC' && kv.dmPhongDai)
              .map((kvKhac, i: number) => (
                <Tooltip title={kvKhac?.dmPhongDai?.ten} key={i}>
                  <Chip
                    size="small"
                    label={`${kvKhac?.dmPhongDai?.tenVietTat}`}
                    sx={{ mb: 1, color: 'text.secondary' }}
                  />
                </Tooltip>
              ))}
          </Stack>
        </TableCell>

        <TableCell key="chucVuKhuVu" align="center">
          <Stack direction="row" flexWrap="wrap" justifyContent="center" gap="4px">
            {nguoiDungKhuVucList
              .filter((kv) => kv.loai === 'KHU_VUC')
              .map((kvKhac, i: number) => (
                <Link
                  href="#"
                  variant="subtitle2"
                  onClick={() => onXemQuyenChucVu(kvKhac?.chucVu || null)}
                  key={i}
                >
                  {kvKhac?.chucVu?.ten}
                </Link>
              ))}
          </Stack>
        </TableCell>

        <TableCell key="status" align="center">
          <Label
            variant="soft"
            color={(trangThai !== 'HOAT_DONG' && 'error') || 'success'}
            sx={{ textTransform: 'capitalize' }}
          >
            {trangThai === 'HOAT_DONG' ? DANG_HOAT_DONG : NGUNG_HOAT_DONG}
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
        // sx={{ width: 140 }}
      >
        <PermissionWrapper module="NGUOI_DUNG" action="CAP_NHAT" hideWhenBlocked checkAt="pdChinh">
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

        {!isYou && (
          <>
            <Divider sx={{ borderStyle: 'dashed' }} />
            <MenuItem
              onClick={() => {
                handleOpenConfirm();
                handleClosePopover();
              }}
              sx={{ color: trangThai === 'HOAT_DONG' ? 'error.main' : 'success.main' }}
            >
              <Iconify
                icon={trangThai === 'HOAT_DONG' ? 'eva:lock-outline' : 'eva:unlock-outline'}
              />
              {trangThai === 'HOAT_DONG' ? 'Ngừng hoạt động' : 'Khôi phục'}
            </MenuItem>
          </>
        )}
      </MenuPopover>

      {openConfirm && (
        <ConfirmDialog
          open={openConfirm}
          onClose={handleCloseConfirm}
          title={trangThai === 'HOAT_DONG' ? 'Ngừng hoạt động' : 'Khôi phục'}
          content={
            trangThai === 'HOAT_DONG'
              ? `Bạn có chắc chắn muốn ngừng hoạt động tài khoản ${email}?\nKhi tài khoản ngừng hoạt động thì ${email} không thể truy cập vào chương trình, tuy nhiên dữ liệu liên quan đến ${email} vẫn còn tồn tại trong hệ thống.`
              : `Bạn có chắc chắn muốn khôi phục tài khoản ${email}`
          }
          action={
            <LoadingButton
              variant="contained"
              type="button"
              color="error"
              loading={isLoading || updating}
              onClick={handleDelete}
            >
              Chắc chắn
            </LoadingButton>
          }
        />
      )}
    </>
  );
}
