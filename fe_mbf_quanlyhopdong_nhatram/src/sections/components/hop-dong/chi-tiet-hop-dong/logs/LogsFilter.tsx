import { Button, Stack } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import React, { useState } from 'react';
import Iconify from 'src/components/iconify/Iconify';

type Props = {
  data?: any;
};
type IFilterDate = {
  fromDate: Date | null;
  toDate: Date | null;
};
export default function LogsFilter({ data }: Props) {
  const defaultValue = {
    fromDate: null,
    toDate: null,
  };
  const [formValues, setFormValues] = useState<IFilterDate>(defaultValue);
  const isFilter = formValues.fromDate !== null || formValues.toDate !== null;
  const handleResetFilter = () => {
    setFormValues(defaultValue);
  };
  return (
    <Stack direction="row" alignItems="center" spacing={2} my={2}>
      <DatePicker
        label="Từ ngày"
        value={formValues.fromDate}
        onChange={(newValue) =>
          setFormValues({
            ...formValues,
            fromDate: newValue,
          })
        }
      />
      <DatePicker
        label="Đến ngày"
        value={formValues.toDate}
        onChange={(newValue) =>
          setFormValues({
            ...formValues,
            toDate: newValue,
          })
        }
      />
      {isFilter && (
        <Button
          color="error"
          sx={{ flexShrink: 0 }}
          variant="outlined"
          onClick={() => handleResetFilter()}
          startIcon={<Iconify icon="eva:refresh-outline" />}
        >
          Làm mới
        </Button>
      )}
    </Stack>
  );
}
