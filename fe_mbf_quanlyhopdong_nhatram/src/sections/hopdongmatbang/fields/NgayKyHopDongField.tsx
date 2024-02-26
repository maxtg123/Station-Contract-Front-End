import { Box, Typography } from '@mui/material';
import RHFDatePicker from 'src/components/hook-form/RHFDatePicker';

const NgayKyHopDongField = () => {
  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="overline" component="p" gutterBottom sx={{ textTransform: 'none' }}>
        Ngày ký hợp đồng <span style={{ color: '#FF0000' }}>(*)</span>
      </Typography>
      <RHFDatePicker name="ngayKy" />
    </Box>
  );
};

export default NgayKyHopDongField;
