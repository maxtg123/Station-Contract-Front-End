import { Box, Typography } from '@mui/material';
import { RHFTextField } from 'src/components/hook-form';

const SiteNameErpField = () => {
  return (
    <Box sx={{ width: '50%' }}>
      <Typography variant="overline" component="p" gutterBottom sx={{ textTransform: 'none' }}>
        Site name ERP <span style={{ color: '#FF0000' }}>(*)</span>
      </Typography>
      <RHFTextField name="siteNameERP" fullWidth hiddenLabel />
    </Box>
  );
};

export default SiteNameErpField;
