import { Box, Typography } from '@mui/material';
import RHFDatePicker from 'src/components/hook-form/RHFDatePicker';

type Props = {
  indexHangMuc: number;
};

const ThoiDiemPhatSinhField = ({ indexHangMuc }: Props) => {
  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="overline" component="p" gutterBottom sx={{ textTransform: 'none' }}>
        Thời điểm phát sinh
      </Typography>
      <RHFDatePicker
        name={`hangMucs.${indexHangMuc}.thoiDiemPhatSinh`}
        datePickerProps={{ actionBar: { actions: ['clear'] } }}
      />
    </Box>
  );
};

export default ThoiDiemPhatSinhField;
