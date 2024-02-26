import { Grid, Stack, Typography } from '@mui/material';
import { IHopDongTramList } from 'src/@types/hopdong';
import Iconify from 'src/components/iconify/Iconify';
import { fDate } from 'src/utils/formatTime';

type Props = {
  data: IHopDongTramList;
};

const DungChung = ({ data }: Props) => (
  <Grid item xs={6} mb={4}>
    <Stack direction="row" spacing={2} alignItems="center" mb={2}>
      <Typography variant="subtitle2" sx={{ color: '#1963AE', fontWeight: '700' }}>
        Dùng Chung{' '}
      </Typography>
      <Iconify
        icon={
          data.hopDongTramDungChung !== null
            ? 'eva:checkmark-circle-fill'
            : 'eva:close-circle-outline'
        }
        sx={{
          width: 20,
          height: 20,
          color: 'success.main',
          ...(data.hopDongTramDungChung === null && { color: 'error.main' }),
        }}
      />
    </Stack>
    {data.hopDongTramDungChung !== null && (
      <>
        <Typography variant="body2" gutterBottom>
          <Typography component="span" variant="body2" sx={{ fontWeight: '700' }}>
            Mã đơn vị cho dùng chung:
          </Typography>{' '}
          {data.hopDongTramDungChung?.maTramDonViDungChung}
        </Typography>
        <Typography variant="body2" gutterBottom>
          <Typography component="span" variant="body2" sx={{ fontWeight: '700' }}>
            Đơn vị dùng chung:
          </Typography>{' '}
          {data.hopDongTramDungChung?.dmDonViDungChung?.ten}
        </Typography>
        <Typography variant="body2" gutterBottom>
          <Typography component="span" variant="body2" sx={{ fontWeight: '700' }}>
            Ngày lắp đặt thiết bị:
          </Typography>{' '}
          {fDate(data.hopDongTramDungChung?.ngayLapDatThietBi)}
        </Typography>
        <Typography variant="body2" gutterBottom>
          <Typography component="span" variant="body2" sx={{ fontWeight: '700' }}>
            Ngày bắt đầu dùng chung:
          </Typography>{' '}
          {fDate(data.hopDongTramDungChung?.ngayBatDauDungChung)}
        </Typography>
        <Typography variant="body2" gutterBottom>
          <Typography component="span" variant="body2" sx={{ fontWeight: '700' }}>
            Ngày kết thúc dùng chung:
          </Typography>{' '}
          {fDate(data.hopDongTramDungChung?.ngayKetThucDungChung)}
        </Typography>
        <Typography variant="body2" gutterBottom>
          <Typography component="span" variant="body2" sx={{ fontWeight: '700' }}>
            Loại hạng mục CSHT:
          </Typography>{' '}
          {data.hopDongTramDungChung?.dmLoaiHangMucCSHT?.ten}
        </Typography>
      </>
    )}
  </Grid>
);

export default DungChung;
