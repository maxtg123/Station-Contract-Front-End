import { FormControl, FormHelperText, TextFieldProps } from '@mui/material';
import { DatePicker, DatePickerSlotsComponentsProps } from '@mui/x-date-pickers';
import { Controller, useFormContext } from 'react-hook-form';

type RHFDatePickerProps = TextFieldProps & {
  name: string;
  label?: string;
  helperText?: React.ReactNode;
  datePickerProps?: DatePickerSlotsComponentsProps<Date>;
};

const RHFDatePicker = ({
  name,
  label,
  helperText,
  datePickerProps,
  ...tfProps
}: RHFDatePickerProps) => {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl sx={{ width: '100%' }}>
          <DatePicker
            label={label}
            value={field.value}
            onChange={(newValue) => {
              field.onChange(newValue);
            }}
            slotProps={{
              textField: { error: !!error, ...tfProps },
              ...datePickerProps,
            }}
          />
          {(!!error || helperText) && (
            <FormHelperText error={!!error}>{error ? error?.message : helperText}</FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
};

export default RHFDatePicker;
