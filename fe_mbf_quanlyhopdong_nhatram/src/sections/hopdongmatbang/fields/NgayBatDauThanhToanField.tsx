import { Box, Typography } from '@mui/material';
import RHFDatePicker from 'src/components/hook-form/RHFDatePicker';

type Props = {
  index: number;
};

const NgayBatDauThanhToanField = ({ index }: Props) => {
  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="overline" component="p" gutterBottom sx={{ textTransform: 'none' }}>
        Ngày bắt đầu yêu cầu thanh toán{' '}
        <Typography component="span" sx={{ color: 'red' }}>
          (*)
        </Typography>
      </Typography>
      <RHFDatePicker name={`hangMucs.${index}.ngayBatDauTT`} />
    </Box>
  );
};

export default NgayBatDauThanhToanField;
