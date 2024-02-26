import { Box, Typography } from '@mui/material';
import { OptionTypeTram } from 'src/@types/common';
import { RHFAutocomplete } from 'src/components/hook-form';
import { useDmKhoanMucQuery } from 'src/data/dmKhoanMuc';

const KhoanMucField = () => {
  const { data } = useDmKhoanMucQuery({ refetchOnWindowFocus: false });
  return (
    <Box width="100%">
      <Typography variant="overline" component="p" gutterBottom sx={{ textTransform: 'none' }}>
        Khoản mục
      </Typography>
      <RHFAutocomplete
        fullWidth
        name="khoanMuc"
        options={
          data
            ? data.elements.map((km) => ({
                id: km.id.toString(),
                ten: km.ma,
              }))
            : []
        }
        getOptionLabel={(option: OptionTypeTram | string) => (option as OptionTypeTram).ten}
        isOptionEqualToValue={(option, value) => option.id === value.id}
      />
    </Box>
  );
};

export default KhoanMucField;
