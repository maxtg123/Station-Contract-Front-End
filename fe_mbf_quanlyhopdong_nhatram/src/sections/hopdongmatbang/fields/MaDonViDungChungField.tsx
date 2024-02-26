import { Box, Typography } from '@mui/material';
import { IHopDongHangMucTramForm } from 'src/@types/hopdong';
import { RHFTextField } from 'src/components/hook-form';

type Props = {
  indexHangMuc: number;
  filedHangMuc: IHopDongHangMucTramForm;
};

const MaDonViDungChungField = ({ indexHangMuc, filedHangMuc }: Props) => {
  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="overline" component="p" gutterBottom sx={{ textTransform: 'none' }}>
        Mã đơn vị cho dùng chung
      </Typography>
      <RHFTextField name={`hangMucs.${indexHangMuc}.maDonViDungChung`} fullWidth hiddenLabel />
    </Box>
  );
};

export default MaDonViDungChungField;
