import { Box, Typography } from '@mui/material';
import { RHFTextField } from 'src/components/hook-form';

const GhiChuPhuLucField = () => {
  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="overline" component="p" gutterBottom sx={{ textTransform: 'none' }}>
        Ghi chú
      </Typography>
      <RHFTextField multiline rows={3} name="ghiChuPhuLuc" hiddenLabel />
    </Box>
  );
};

export default GhiChuPhuLucField;
