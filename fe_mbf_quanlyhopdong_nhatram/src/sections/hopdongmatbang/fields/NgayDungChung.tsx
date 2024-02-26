import { Box, Stack, Typography } from '@mui/material';
import RHFDatePicker from 'src/components/hook-form/RHFDatePicker';

type Props = {
  indexHangMuc: number;
};
const NgayDungChung = ({ indexHangMuc }: Props) => {
  return (
    <Stack direction="row" spacing={2} mb={4}>
      <Box sx={{ width: '50%' }}>
        <Typography variant="overline" component="p" gutterBottom sx={{ textTransform: 'none' }}>
          Ngày bắt đầu dùng chung
        </Typography>
        <RHFDatePicker
          name={`hangMucs.${indexHangMuc}.ngayBatDauDungChung`}
          datePickerProps={{ actionBar: { actions: ['clear'] } }}
        />
      </Box>

      <Box sx={{ width: '50%' }}>
        <Typography variant="overline" component="p" gutterBottom sx={{ textTransform: 'none' }}>
          Ngày kết thúc dùng chung
        </Typography>
        <RHFDatePicker
          name={`hangMucs.${indexHangMuc}.ngayKetThucDungChung`}
          datePickerProps={{ actionBar: { actions: ['clear'] } }}
        />
      </Box>
    </Stack>
  );
};

export default NgayDungChung;
