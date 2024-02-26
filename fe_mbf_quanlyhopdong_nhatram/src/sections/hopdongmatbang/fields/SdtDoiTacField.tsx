import { Box, Typography } from '@mui/material';
import { RHFTextField } from 'src/components/hook-form';

const SdtDoiTacField = () => {
  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="overline" component="p" gutterBottom sx={{ textTransform: 'none' }}>
        Số điện thoại <span style={{ color: '#FF0000' }}>(*)</span>
      </Typography>
      <RHFTextField name="sdt" fullWidth hiddenLabel />
    </Box>
  );
};

export default SdtDoiTacField;
