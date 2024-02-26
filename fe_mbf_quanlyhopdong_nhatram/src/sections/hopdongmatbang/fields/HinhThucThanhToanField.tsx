import { Box, BoxProps, MenuItem, Typography } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { IHopDongForm } from 'src/@types/hopdongmatbang';
import { RHFSelect } from 'src/components/hook-form';
import { useDmHinhThucThanhToansQuery } from 'src/data/dmHinhThucThanhToan';

type Props = BoxProps;

const HinhThucThanhToanField = ({ ...boxProps }: Props) => {
  const { data } = useDmHinhThucThanhToansQuery({ refetchOnWindowFocus: false });
  const { setValue } = useFormContext<IHopDongForm>();
  return (
    <Box sx={{ width: '100%' }} {...boxProps}>
      <Typography variant="overline" component="p" gutterBottom sx={{ textTransform: 'none' }}>
        Hình thức thanh toán <span style={{ color: '#FF0000' }}>(*)</span>
      </Typography>
      <RHFSelect
        name="hinhThucThanhToan.id"
        hiddenLabel
        onChange={(e) => {
          const id = Number(e.target.value);
          const ten = data?.elements.find((dt) => dt.id === id)?.ten || '';
          setValue('hinhThucThanhToan', { id, ten });
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

export default HinhThucThanhToanField;
