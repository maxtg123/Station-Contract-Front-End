import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { IHopDongTramList } from 'src/@types/hopdong';
import Scrollbar from 'src/components/scrollbar/Scrollbar';
import { fCurrencyVND } from 'src/utils/formatNumber';
import { fDate } from 'src/utils/formatTime';

const StyledRowResult = styled(TableRow)(({ theme }) => ({
  '& td': {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));

type Props = {
  data: IHopDongTramList;
};
const TatCaKyThanhToan = ({ data }: Props) => (
  <Grid item xs={12}>
    <Typography
      variant="subtitle2"
      gutterBottom
      sx={{ color: '#1963AE', fontWeight: '700', mb: '16px' }}
    >
      TẤT CẢ KỲ THANH TOÁN
    </Typography>
    <TableContainer sx={{ overflow: 'unset' }}>
      <Scrollbar>
        <Table>
          <TableHead
            sx={{
              borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
              '& th': { backgroundColor: 'transparent' },
            }}
          >
            <TableRow>
              <TableCell>#</TableCell>

              <TableCell align="left">Từ ngày</TableCell>

              <TableCell align="left">Đến ngày</TableCell>

              <TableCell align="right">Số tiền</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data.hopDongTramKyThanhToanList.map((item, index) => (
              <TableRow key={index}>
                <TableCell>Kỳ {index + 1}</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>{fDate(item.tuNgay)}</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>{fDate(item.denNgay)}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  {fCurrencyVND(item.giaTien)}
                </TableCell>
              </TableRow>
            ))}
            <StyledRowResult>
              <TableCell colSpan={2} />

              <TableCell align="right" sx={{ typography: 'h6' }}>
                Tổng tiền
              </TableCell>

              <TableCell align="right" width={300} sx={{ typography: 'h6' }}>
                {fCurrencyVND(
                  data.hopDongTramKyThanhToanList.reduce(
                    (tong, currentValue) => tong + currentValue.giaTien,
                    0
                  )
                )}{' '}
                VNĐ
              </TableCell>
            </StyledRowResult>
          </TableBody>
        </Table>
      </Scrollbar>
    </TableContainer>
  </Grid>
);

export default TatCaKyThanhToan;
