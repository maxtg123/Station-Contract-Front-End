import { Box, Typography } from '@mui/material';
import { RHFTextField } from 'src/components/hook-form';

const NganHangField = () => {
  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="overline" component="p" gutterBottom sx={{ textTransform: 'none' }}>
        Ngân hàng - Chi nhánh <span style={{ color: '#FF0000' }}>(*)</span>
      </Typography>
      <RHFTextField multiline rows={2} name="nganHangChiNhanh" hiddenLabel />
    </Box>
  );
};

export default NganHangField;
