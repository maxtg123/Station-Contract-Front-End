import { Box, Typography } from '@mui/material';
import { RHFTextField } from 'src/components/hook-form';

const SoHopDongErpField = () => {
  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="overline" component="p" gutterBottom sx={{ textTransform: 'none' }}>
        Số hợp đồng ERP
      </Typography>
      <RHFTextField name="soHopDongERP" fullWidth hiddenLabel />
    </Box>
  );
};

export default SoHopDongErpField;
