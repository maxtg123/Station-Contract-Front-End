import { Box, Typography } from '@mui/material';
import { OptionTypeTram } from 'src/@types/common';
import { RHFAutocomplete } from 'src/components/hook-form';
import { useDmDonViDungChungQuery } from 'src/data/dmDonViDungChung';

type Props = {
  indexHangMuc: number;
};
const DonViDungChungField = ({ indexHangMuc }: Props) => {
  const { data } = useDmDonViDungChungQuery({ refetchOnWindowFocus: false });
  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="overline" component="p" gutterBottom sx={{ textTransform: 'none' }}>
        Đơn vị dùng chung
      </Typography>
      <RHFAutocomplete
        fullWidth
        name={`hangMucs.${indexHangMuc}.donViDungChung`}
        options={
          data
            ? data.elements.map((dvdc) => ({
                id: dvdc.id.toString(),
                ten: dvdc.ten,
              }))
            : []
        }
        getOptionLabel={(option: OptionTypeTram | string) => (option as OptionTypeTram).ten}
        isOptionEqualToValue={(option, value) => option.id === value.id}
      />
    </Box>
  );
};

export default DonViDungChungField;
