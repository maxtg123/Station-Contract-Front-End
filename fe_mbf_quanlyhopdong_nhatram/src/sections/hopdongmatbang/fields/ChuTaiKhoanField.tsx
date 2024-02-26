import { Box, Typography } from '@mui/material';
import { RHFTextField } from 'src/components/hook-form';

const ChuTaiKhoanField = () => {
  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="overline" component="p" gutterBottom sx={{ textTransform: 'none' }}>
        Chủ tài khoản <span style={{ color: '#FF0000' }}>(*)</span>
      </Typography>
      <RHFTextField name="chuTaiKhoan" fullWidth hiddenLabel />
    </Box>
  );
};

export default ChuTaiKhoanField;
