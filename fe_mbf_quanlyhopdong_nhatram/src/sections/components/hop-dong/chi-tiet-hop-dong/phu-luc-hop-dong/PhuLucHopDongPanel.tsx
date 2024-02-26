// @mui
import { IconButton, Stack, StackProps, Typography } from '@mui/material';
import { IHopDongPhuLuc } from 'src/@types/hopdong';
import { CustomAvatar } from 'src/components/custom-avatar';
import Iconify from 'src/components/iconify/Iconify';
import { fDateTime } from 'src/utils/formatTime';
// components

// ----------------------------------------------------------------------

interface Props extends StackProps {
  thongTinPhuLuc: IHopDongPhuLuc;
  onOpen?: VoidFunction;
  collapse?: boolean;
  onCollapse?: VoidFunction;
}

export default function PhuLucHopDongPanel({
  thongTinPhuLuc,
  onOpen,
  collapse,
  onCollapse,
  sx,
  ...other
}: Props) {
  return (
    <Stack direction="row" alignItems="center" sx={{ mb: 3, ...sx }} {...other}>
      <Stack flexGrow={1}>
        <Stack direction="row" spacing={1} alignItems="flex-start">
          <CustomAvatar name={thongTinPhuLuc?.nguoiTao?.email} />
          <Stack direction="column">
            <Typography variant="h6"> {thongTinPhuLuc?.nguoiTao?.hoTen} </Typography>
            <Typography variant="subtitle2">Số phụ lục: {thongTinPhuLuc.soPhuLuc}</Typography>
            <Typography variant="body2">
              Ngày hiệu lực: {fDateTime(thongTinPhuLuc.ngayHieuLuc)}
            </Typography>
            <Typography variant="body2">
              Ngày kết thúc: {fDateTime(thongTinPhuLuc.ngayKetThuc)}
            </Typography>
            <Typography variant="body2">Ghi chú: {thongTinPhuLuc.ghiChu}</Typography>
            <Typography variant="body2" sx={{ color: 'text.disabled' }}>
              Ngày upload: {fDateTime(thongTinPhuLuc.createdAt)}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
      {onCollapse && (
        <IconButton onClick={onCollapse}>
          <Iconify icon={collapse ? 'eva:chevron-down-fill' : 'eva:chevron-up-fill'} />
        </IconButton>
      )}
    </Stack>
  );
}
