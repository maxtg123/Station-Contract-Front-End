import {
  Box,
  BoxProps,
  FormControl,
  FormHelperText,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { IHopDongForm } from 'src/@types/hopdongmatbang';
import NumericFormatVND from 'src/components/input/NumericFormatVND';

type Props = BoxProps & {
  index: number;
};
const GiaThueField = ({ index, ...boxProps }: Props) => {
  const { control, setValue } = useFormContext<IHopDongForm>();

  return (
    <Box sx={{ width: '100%' }} {...boxProps}>
      <Typography variant="overline" component="p" gutterBottom sx={{ textTransform: 'none' }}>
        Giá thuê trạm (+VAT)/tháng{' '}
        <Typography component="span" sx={{ color: 'red' }}>
          (*)
        </Typography>
      </Typography>

      <Controller
        name={`hangMucs.${index}.giaThueTram`}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <FormControl sx={{ width: '100%' }}>
            <TextField
              {...field}
              fullWidth
              value={typeof field.value === 'number' && field.value === 0 ? 0 : field.value}
              error={!!error}
              InputProps={{
                inputComponent: NumericFormatVND as any,
                endAdornment: <InputAdornment position="end">VNĐ</InputAdornment>,
              }}
            />
            {!!error && (
              <FormHelperText error={!!error}>{error ? error?.message : ''}</FormHelperText>
            )}
          </FormControl>
        )}
      />
    </Box>
  );
};

export default GiaThueField;
