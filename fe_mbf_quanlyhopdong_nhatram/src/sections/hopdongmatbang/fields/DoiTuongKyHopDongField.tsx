import { Box, MenuItem, Typography } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { IHopDongForm } from 'src/@types/hopdongmatbang';
import { RHFSelect } from 'src/components/hook-form';
import { useDmDoiTuongKyHopDongsQuery } from 'src/data/dmDoiTuongKyHopDong';

const DoiTuongKyHopDongField = () => {
  const { data } = useDmDoiTuongKyHopDongsQuery({ refetchOnWindowFocus: false });
  const { setValue } = useFormContext<IHopDongForm>();
  return (
    <Box width="100%">
      <Typography variant="overline" component="p" gutterBottom sx={{ textTransform: 'none' }}>
        Đối tượng ký hợp đồng <span style={{ color: '#FF0000' }}>(*)</span>
      </Typography>
      <RHFSelect
        fullWidth
        name="doiTuongKy.id"
        onChange={(e) => {
          const id = Number(e.target.value);
          const ten = data?.elements.find((dt) => dt.id === id)?.ten || '';
          setValue('doiTuongKy', { id, ten });
        }}
      >
        {data
          ? data?.elements.map((row, key) => (
              <MenuItem key={key} value={row.id}>
                {row.ten}
              </MenuItem>
            ))
          : []}
      </RHFSelect>
    </Box>
  );
};

export default DoiTuongKyHopDongField;
