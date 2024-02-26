import { Grid, Typography } from '@mui/material';
import { IHopDong } from 'src/@types/hopdongmatbang';
import { fCurrencyVND } from 'src/utils/formatNumber';

type Props = {
  data: IHopDong;
};
const SoTienThanhToan = ({ data }: Props) => (
  <Grid item xs={6}>
    <Typography
      variant="subtitle2"
      gutterBottom
      sx={{ color: '#1963AE', fontWeight: '700', mb: '16px' }}
    >
      SỐ TIỀN THANH TOÁN (VNĐ)
    </Typography>
    <Typography variant="body2" gutterBottom>
      <Typography component="span" variant="body2" sx={{ fontWeight: '700' }}>
        Chu kỳ thanh toán:
      </Typography>{' '}
      {data.chuKyNam !== 0 && `${data.chuKyNam} năm `}
      {data.chuKyThang !== 0 && `${data.chuKyThang} tháng `}
      {data.chuKyNgay !== 0 && `${data.chuKyNgay} ngày `}
    </Typography>
    <Typography variant="body2" gutterBottom>
      <Typography component="span" variant="body2" sx={{ fontWeight: '700' }}>
        Thuế VAT:
      </Typography>{' '}
      {data.thueVat !== null && `${data.thueVat}%`}
    </Typography>
  </Grid>
);

export default SoTienThanhToan;
