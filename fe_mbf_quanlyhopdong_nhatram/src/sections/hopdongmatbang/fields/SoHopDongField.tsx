import { Box, Typography } from '@mui/material';
import { RHFTextField } from 'src/components/hook-form';

const SoHopDongField = () => {
  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="overline" component="p" gutterBottom sx={{ textTransform: 'none' }}>
        Số hợp đồng <span style={{ color: '#FF0000' }}>(*)</span>
      </Typography>
      <RHFTextField name="soHopDong" fullWidth hiddenLabel />
    </Box>
  );
};

export default SoHopDongField;
