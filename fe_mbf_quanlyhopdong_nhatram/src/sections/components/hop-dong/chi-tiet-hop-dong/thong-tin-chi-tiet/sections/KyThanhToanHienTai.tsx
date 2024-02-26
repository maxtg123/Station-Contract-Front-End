import { Grid, Typography } from '@mui/material';
import isUndefined from 'lodash/isUndefined';
import { IHopDongKyThanhToan, IHopDongTramList } from 'src/@types/hopdong';
import { fCurrencyVND } from 'src/utils/formatNumber';
import { fDate } from 'src/utils/formatTime';

type Props = {
  data: IHopDongTramList;
};

const KyThanhToanHienTai = ({ data }: Props) => {
  const kyThanhToan = data.hopDongTramKyThanhToanList.find(
    (item: IHopDongKyThanhToan) => item.daThanhToanNgay === null
  );
  return (
    <Grid item xs={6} mb={4}>
      <Typography
        variant="subtitle2"
        gutterBottom
        sx={{ color: '#1963AE', fontWeight: '700', mb: '16px' }}
      >
        KỲ THANH TOÁN HIỆN TẠI
      </Typography>
      {!isUndefined(kyThanhToan) && (
        <>
          <Typography variant="body2" gutterBottom>
            <Typography component="span" variant="body2" sx={{ fontWeight: '700' }}>
              Từ ngày:
            </Typography>{' '}
            {fDate(kyThanhToan.tuNgay)}
          </Typography>
          <Typography variant="body2" gutterBottom>
            <Typography component="span" variant="body2" sx={{ fontWeight: '700' }}>
              Đến ngày:
            </Typography>{' '}
            {fDate(kyThanhToan.denNgay)}
          </Typography>
          <Typography variant="body2" gutterBottom>
            <Typography component="span" variant="body2" sx={{ fontWeight: '700' }}>
              Số tiền:
            </Typography>{' '}
            {fCurrencyVND(kyThanhToan.giaTien)}
          </Typography>
        </>
      )}
    </Grid>
  );
};

export default KyThanhToanHienTai;
