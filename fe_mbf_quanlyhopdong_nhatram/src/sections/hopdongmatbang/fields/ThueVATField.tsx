import { Autocomplete, Box, TextField, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { IHopDongForm } from 'src/@types/hopdongmatbang';
import { useDmThuesQuery } from 'src/data/dmThue';

type OptionType = {
  value: number;
  label: string;
};

const ThueVATField = () => {
  const { data: thues } = useDmThuesQuery({ refetchOnWindowFocus: false });
  const { control, setValue, watch } = useFormContext<IHopDongForm>();
  const wThueVat = watch('thueVAT');

  const [selectedOpt, setSelectedOpt] = useState<OptionType | null>(null);

  // setSelectedOpt
  useEffect(() => {
    if (wThueVat && thues) {
      const thue = thues.elements.find((t) => t.soThue === wThueVat);
      if (thue) {
        setSelectedOpt({ value: thue.id, label: `${thue.soThue}%` });
      }
    } else {
      setSelectedOpt(null);
    }
  }, [wThueVat, thues]);

  const opts: OptionType[] = useMemo(() => {
    if (thues && thues?.elements && thues.elements.length > 0) {
      return thues.elements.map((dt) => ({
        value: dt.soThue,
        label: `${dt.soThue}%`,
      }));
    }
    return [];
  }, [thues]);

  return (
    <Box sx={{ width: '100%', mt: 1 }}>
      <Typography variant="overline" component="p" gutterBottom sx={{ textTransform: 'none' }}>
        Thuế VAT
      </Typography>
      <Controller
        name="thueVAT"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <Autocomplete
            value={selectedOpt}
            options={opts}
            getOptionLabel={(option: OptionType | string) => {
              return (option as OptionType).label;
            }}
            onChange={(event, newValue) => {
              if (newValue === null) {
                setValue('thueVAT', null);
              } else {
                setValue('thueVAT', newValue.value);
              }
            }}
            renderInput={(params) => (
              <TextField
                {...field}
                hiddenLabel
                error={!!error}
                helperText={error ? error?.message : ''}
                {...params}
              />
            )}
          />
        )}
      />
    </Box>
  );
};

export default ThueVATField;
