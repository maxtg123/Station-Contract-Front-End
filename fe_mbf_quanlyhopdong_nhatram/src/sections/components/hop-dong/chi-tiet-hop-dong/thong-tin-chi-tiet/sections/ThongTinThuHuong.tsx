import { Grid, Typography } from '@mui/material';
import { IHopDong } from 'src/@types/hopdongmatbang';

type Props = {
  data: IHopDong;
};
const ThongTinThuHuong = ({ data }: Props) => (
  <Grid item xs={6}>
    <Typography
      variant="subtitle2"
      gutterBottom
      sx={{ color: '#1963AE', fontWeight: '700', mb: '16px' }}
    >
      THÔNG TIN THỤ HƯỞNG
    </Typography>
    <Typography variant="body2" gutterBottom>
      <Typography component="span" variant="body2" sx={{ fontWeight: '700' }}>
        Tên chủ tài khoản:
      </Typography>{' '}
      {data.hopDongDoiTac.chuTaiKhoan}
    </Typography>
    <Typography variant="body2" gutterBottom>
      <Typography component="span" variant="body2" sx={{ fontWeight: '700' }}>
        Số tài khoản:
      </Typography>{' '}
      {data.hopDongDoiTac.soTaiKhoan}
    </Typography>
    <Typography variant="body2" gutterBottom>
      <Typography component="span" variant="body2" sx={{ fontWeight: '700' }}>
        Ngân hàng chi nhánh:
      </Typography>{' '}
      {data.hopDongDoiTac.nganHangChiNhanh}
    </Typography>
    <Typography variant="body2" gutterBottom>
      <Typography component="span" variant="body2" sx={{ fontWeight: '700' }}>
        Hình thức thanh toán:
      </Typography>{' '}
      {data.dmHinhThucThanhToan.ten}
    </Typography>
  </Grid>
);

export default ThongTinThuHuong;
