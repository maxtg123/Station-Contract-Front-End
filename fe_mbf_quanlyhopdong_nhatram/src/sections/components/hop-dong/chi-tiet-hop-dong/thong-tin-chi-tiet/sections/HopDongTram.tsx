import { Box, Typography, Stack } from '@mui/material';
import { IHopDong } from 'src/@types/hopdongmatbang';
import Iconify from 'src/components/iconify/Iconify';
import { fDate } from 'src/utils/formatTime';
import { fCurrencyVND } from 'src/utils/formatNumber';

type Props = {
  data: IHopDong;
};
const HopDongTram = ({ data }: Props) => (
  <Box>
    <Typography
      variant="subtitle2"
      gutterBottom
      sx={{ color: '#1963AE', fontWeight: '700', mb: '16px' }}
    >
      HỢP ĐỒNG TRẠM
    </Typography>
    <Typography variant="body2" gutterBottom>
      <Typography component="span" variant="body2" sx={{ fontWeight: '700' }}>
        Số hợp đồng:
      </Typography>{' '}
      {data.soHopDong}
    </Typography>
    <Typography variant="body2" gutterBottom>
      <Typography component="span" variant="body2" sx={{ fontWeight: '700' }}>
        Số hợp đồng ERP:
      </Typography>{' '}
      {data.soHopDongErp}
    </Typography>
    <Typography variant="body2" gutterBottom>
      <Typography component="span" variant="body2" sx={{ fontWeight: '700' }}>
        Ngày ký:
      </Typography>{' '}
      {fDate(data.ngayKy)}
    </Typography>
    <Typography variant="body2" gutterBottom>
      <Typography component="span" variant="body2" sx={{ fontWeight: '700' }}>
        Ngày kết thúc:
      </Typography>{' '}
      {fDate(data.ngayKetThuc)}
    </Typography>
    <Typography variant="body2" gutterBottom>
      <Typography component="span" variant="body2" sx={{ fontWeight: '700' }}>
        Chủ thể hợp đồng:
      </Typography>{' '}
      {data.hopDongDoiTac.ten}
    </Typography>
    <Typography variant="body2" gutterBottom>
      <Typography component="span" variant="body2" sx={{ fontWeight: '700' }}>
        Đối tượng ký hợp đồng:
      </Typography>{' '}
      {data.dmDoiTuongKyHopDong?.ten}
    </Typography>
    <Stack direction="row" spacing={2} alignItems="center" mb={1}>
      <Typography component="span" variant="body2" sx={{ fontWeight: '700' }}>
        Ký quỹ:
      </Typography>{' '}
      <Iconify
        icon={data.coKyQuy ? 'eva:checkmark-circle-fill' : 'eva:close-circle-outline'}
        sx={{
          width: 20,
          height: 20,
          color: 'success.main',
          ...(!data.coKyQuy && { color: 'error.main' }),
        }}
      />
    </Stack>
    <Typography variant="body2" gutterBottom>
      <Typography component="span" variant="body2" sx={{ fontWeight: '700' }}>
        Giá ký quỹ:
      </Typography>{' '}
      {fCurrencyVND(data.giaKyQuy)}
    </Typography>
    <Typography variant="body2" gutterBottom>
      <Typography component="span" variant="body2" sx={{ fontWeight: '700' }}>
        Hình thức ký hợp đồng:
      </Typography>{' '}
      {data.dmHinhThucKyHopDong?.ten}
    </Typography>
    <Typography variant="body2" gutterBottom>
      <Typography component="span" variant="body2" sx={{ fontWeight: '700' }}>
        Ngày tạo hợp đồng:
      </Typography>{' '}
      {fDate(data.createdAt)}
    </Typography>
    <Typography variant="body2" gutterBottom>
      <Typography component="span" variant="body2" sx={{ fontWeight: '700' }}>
        Ngày cập nhật lần cuối:
      </Typography>{' '}
      {fDate(data.updatedAt)}
    </Typography>
  </Box>
);

export default HopDongTram;
