import { Box, Typography } from '@mui/material';
import RHFDatePicker from 'src/components/hook-form/RHFDatePicker';

const NgayKetThucHopDongField = () => {
  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="overline" component="p" gutterBottom sx={{ textTransform: 'none' }}>
        Ngày kết thúc hợp đồng <span style={{ color: '#FF0000' }}>(*)</span>
      </Typography>
      <RHFDatePicker name="ngayKetThuc" />
    </Box>
  );
};

export default NgayKetThucHopDongField;
