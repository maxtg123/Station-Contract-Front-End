import { Box, Typography } from '@mui/material';
import { RHFTextField } from 'src/components/hook-form';

const CmndDoiTacField = () => {
  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="overline" component="p" gutterBottom sx={{ textTransform: 'none' }}>
        Số CMND/CCCD <span style={{ color: '#FF0000' }}>(*)</span>
      </Typography>
      <RHFTextField name="soCMND" fullWidth hiddenLabel />
    </Box>
  );
};

export default CmndDoiTacField;
