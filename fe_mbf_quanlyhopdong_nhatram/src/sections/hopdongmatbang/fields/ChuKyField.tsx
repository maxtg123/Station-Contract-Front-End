import { Box, Stack, Typography } from '@mui/material';
import RHFTextFieldHasZero from 'src/components/hook-form/RHFTextFieldHasZero';
import NumericPositiveFormat from 'src/components/input/NumericPositiveFormat';

const ChuKyField = () => {
  return (
    <Stack direction="row" spacing={2} width="100%">
      <Box sx={{ width: '100%' }}>
        <Typography variant="overline" component="p" gutterBottom sx={{ textTransform: 'none' }}>
          Chu kỳ thanh toán{' '}
          <Typography component="span" sx={{ color: 'red' }}>
            (*)
          </Typography>
        </Typography>
        <Stack direction="row" spacing={2}>
          <RHFTextFieldHasZero
            name="chuKyNam"
            fullWidth
            label="Năm"
            InputProps={{
              inputComponent: NumericPositiveFormat as any,
            }}
          />
          <RHFTextFieldHasZero
            name="chuKyThang"
            fullWidth
            label="Tháng"
            InputProps={{
              inputComponent: NumericPositiveFormat as any,
            }}
          />
          <RHFTextFieldHasZero
            name="chuKyNgay"
            fullWidth
            label="Ngày"
            InputProps={{
              inputComponent: NumericPositiveFormat as any,
            }}
          />
        </Stack>
      </Box>
    </Stack>
  );
};

export default ChuKyField;
