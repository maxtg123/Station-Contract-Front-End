import { Box, Typography } from '@mui/material';
import { memo } from 'react';
import RHFTextFieldHasZero from 'src/components/hook-form/RHFTextFieldHasZero';

const MaSoThueField = () => (
  <Box sx={{ width: '100%' }}>
    <Typography variant="overline" component="p" gutterBottom sx={{ textTransform: 'none' }}>
      Mã số thuế
    </Typography>
    <RHFTextFieldHasZero name="maSoThue" fullWidth hiddenLabel />
  </Box>
);

export default memo(MaSoThueField);
