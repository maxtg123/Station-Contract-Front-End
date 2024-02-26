import { Box, Typography } from '@mui/material';
import { RHFTextField } from 'src/components/hook-form';

const TenDoiTacField = () => {
  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="overline" component="p" gutterBottom sx={{ textTransform: 'none' }}>
        Tên đối tác <span style={{ color: '#FF0000' }}>(*)</span>
      </Typography>
      <RHFTextField name="tenDoiTac" fullWidth hiddenLabel />
    </Box>
  );
};

export default TenDoiTacField;
