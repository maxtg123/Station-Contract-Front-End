import { Box, MenuItem, Typography } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { IHopDongForm } from 'src/@types/hopdongmatbang';
import { RHFSelect } from 'src/components/hook-form';
import { useDmHinhThucKyHDQuery } from 'src/data/dmHinhThucKyHD';

const HinhThucKyHopDongField = () => {
  const { data } = useDmHinhThucKyHDQuery({ refetchOnWindowFocus: false });
  const { setValue } = useFormContext<IHopDongForm>();
  return (
    <Box width="100%">
      <Typography variant="overline" component="p" gutterBottom sx={{ textTransform: 'none' }}>
        Hình thức ký hợp đồng <span style={{ color: '#FF0000' }}>(*)</span>
      </Typography>
      <RHFSelect
        name="hinhThucKy.id"
        hiddenLabel
        onChange={(e) => {
          const id = Number(e.target.value);
          const ten = data?.elements.find((dt) => dt.id === id)?.ten || '';
          setValue('hinhThucKy', { id, ten });
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

export default HinhThucKyHopDongField;
