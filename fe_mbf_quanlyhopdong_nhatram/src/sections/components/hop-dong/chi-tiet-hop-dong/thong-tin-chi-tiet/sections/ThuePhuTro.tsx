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

const StyledRowResult = styled(TableRow)(({ theme }) => ({
  '& td': {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));

type Props = {
  data: IHopDongTramList;
};
const ThuePhuTro = ({ data }: Props) => {
  if (!data || !data.hopDongTramPhuTroList || data.hopDongTramPhuTroList.length === 0) {
    return <></>;
  }
  const dataPhuTro = data.hopDongTramPhuTroList.filter(
    (itemPhuTro) => itemPhuTro.hienThiThongTinChiTiet === false
  );
  return data.hopDongTramPhuTroList.length > 0 ? (
    <Grid container spacing={2} mb={4}>
      <Grid item xs={12}>
        <Typography
          variant="subtitle2"
          gutterBottom
          sx={{ color: '#1963AE', fontWeight: '700', mb: '16px' }}
        >
          THUÊ PHỤ TRỢ
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
                  <TableCell width={40}>#</TableCell>

                  <TableCell align="left">Loại phụ trợ</TableCell>

                  <TableCell align="right">Giá</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {data.hopDongTramPhuTroList.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>{item.dmLoaiHopDongPhuTro.ten}</TableCell>
                    <TableCell align="right">
                      {item.hienThiThongTinChiTiet === true ? fCurrencyVND(item.gia) : null}
                    </TableCell>
                  </TableRow>
                ))}
                {!(dataPhuTro.length === data.hopDongTramPhuTroList.length) && (
                  <StyledRowResult>
                    <TableCell colSpan={1} />

                    <TableCell align="right" sx={{ typography: 'h6' }}>
                      Tổng
                    </TableCell>

                    <TableCell align="right" width={200} sx={{ typography: 'h6' }}>
                      {fCurrencyVND(
                        data.hopDongTramPhuTroList.reduce(
                          (tong, currentValue) =>
                            tong +
                            (currentValue.hienThiThongTinChiTiet === true ? currentValue.gia : 0),
                          0
                        )
                      )}{' '}
                      VNĐ
                    </TableCell>
                  </StyledRowResult>
                )}
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>
      </Grid>
    </Grid>
  ) : (
    <></>
  );
};

export default ThuePhuTro;
