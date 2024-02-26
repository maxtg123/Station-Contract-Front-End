import { Box, Typography } from '@mui/material';
import { RHFTextField } from 'src/components/hook-form';

const DiaChiLienHeField = () => {
  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="overline" component="p" gutterBottom sx={{ textTransform: 'none' }}>
        Địa chỉ liên hệ
      </Typography>
      <RHFTextField multiline rows={3} name="diaChiLienHe" fullWidth hiddenLabel />
    </Box>
  );
};

export default DiaChiLienHeField;
