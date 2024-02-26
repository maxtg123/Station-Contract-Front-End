// form
import { Controller, useFormContext } from 'react-hook-form';
// @mui
import { TextFieldProps } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
// components

// ----------------------------------------------------------------------

type RHFDateProps = TextFieldProps & {
  name: string;
  label?: string;
  native?: boolean;
  maxHeight?: boolean | number;
};
// ----------------------------------------------------------------------

export default function RHFDate({
  name,
  maxHeight = 220,
  helperText,
  children,
  label,
  ...other
}: RHFDateProps) {
  const { control, setValue } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <DatePicker
          sx={{ width: '100%' }}
          label={label}
          value={field.value}
          onChange={(newValue) => {
            setValue(name, newValue);
          }}
        />
      )}
    />
  );
}
