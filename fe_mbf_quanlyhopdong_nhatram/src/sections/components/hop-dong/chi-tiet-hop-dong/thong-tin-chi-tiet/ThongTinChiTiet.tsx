import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import isNull from 'lodash/isNull';
import { useState } from 'react';
import { IHopDong } from 'src/@types/hopdongmatbang';
import LichSuThanhToanDialog from 'src/components/dialogs/lichsu-thanhtoan-dialog';
import Iconify from 'src/components/iconify';
import Image from 'src/components/image/Image';
import { TINH_TRANG_HOP_DONG } from 'src/constants/hopdongmatbang.constant';
import HopDongTram from './sections/HopDongTram';
import SoTienThanhToan from './sections/SoTienThanhToan';
import ThongTinDocTac from './sections/ThongTinDocTac';
import ThongTinThuHuong from './sections/ThongTinThuHuong';
import ThongTinTramList from './sections/ThongTinTramList';

type Props = {
  data: IHopDong | null;
};

export default function ThongTinChiTiet({ data }: Props) {
  if (isNull(data)) {
    return null;
  }
  return (
    <Box sx={{ paddingX: 2 }}>
      <Stack direction="row" mt={2} mb={4} alignItems="center" justifyContent="space-between">
        <Stack direction="row" spacing={2} alignItems="center">
          <Tooltip title="Chỉnh sửa">
            <IconButton onClick={() => {}}>
              <Iconify icon="eva:edit-fill" />
            </IconButton>
          </Tooltip>
        </Stack>
        <Stack direction="row" spacing={2}>
          {data.trangThaiHopDong === TINH_TRANG_HOP_DONG.nhap && (
            <Button
              onClick={() => {}}
              variant="contained"
              startIcon={<Iconify icon="eva:checkmark-circle-fill" />}
            >
              Gửi phê duyệt
            </Button>
          )}
          {data.trangThaiHopDong === TINH_TRANG_HOP_DONG.choGuiPheDuyet && (
            <>
              <Button
                onClick={() => console.log('Xóa khỏi danh sách chờ gửi phê duyệt')}
                variant="contained"
                startIcon={<Iconify icon="eva:trash-2-outline" />}
              >
                Xóa khỏi danh sách chờ gửi phê duyệt
              </Button>
              <Button
                onClick={() => {}}
                variant="contained"
                startIcon={<Iconify icon="eva:checkmark-circle-fill" />}
              >
                Gửi phê duyệt
              </Button>
            </>
          )}
        </Stack>
      </Stack>
      <Grid container>
        <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
          <Image disabledEffect alt="logo" src="/logo/logo-mbf.png" sx={{ maxWidth: 209 }} />
        </Grid>
      </Grid>
      <Grid container spacing={2} mb={4}>
        <Grid item xs={6}>
          <Stack direction="column" spacing={4}>
            <HopDongTram data={data} />
            <SoTienThanhToan data={data} />
          </Stack>
        </Grid>
        <Grid item xs={6}>
          <Stack direction="column" spacing={4}>
            <ThongTinDocTac data={data} />
            <ThongTinThuHuong data={data} />
          </Stack>
        </Grid>
      </Grid>
      <Grid container spacing={2} mb={4} paddingX={2}>
        <Typography
          variant="subtitle2"
          gutterBottom
          sx={{ color: '#1963AE', fontWeight: '700', mb: '16px' }}
        >
          THÔNG TIN DANH SÁCH TRẠM
        </Typography>
        <ThongTinTramList data={data.hopDongTramList} />
      </Grid>

      <Divider />
      <Stack direction="column" spacing={1} my={2}>
        <Typography variant="subtitle1">Ghi chú</Typography>
        <Typography variant="body1">{data.ghiChu}</Typography>
      </Stack>
    </Box>
  );
}
