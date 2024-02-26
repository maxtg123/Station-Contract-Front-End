import { Box, Typography } from '@mui/material';
import RHFDatePicker from 'src/components/hook-form/RHFDatePicker';

type Props = {
  indexHangMuc: number;
};
const NgayLapDatThietBiField = ({ indexHangMuc }: Props) => {
  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="overline" component="p" gutterBottom sx={{ textTransform: 'none' }}>
        Ngày lắp đặt thiết bị
      </Typography>
      <RHFDatePicker
        name={`hangMucs.${indexHangMuc}.ngayLapDatThietBi`}
        datePickerProps={{ actionBar: { actions: ['clear'] } }}
      />
    </Box>
  );
};

export default NgayLapDatThietBiField;
