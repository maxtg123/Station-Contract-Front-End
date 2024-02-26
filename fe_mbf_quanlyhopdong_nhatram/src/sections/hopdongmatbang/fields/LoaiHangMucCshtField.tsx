import { Box, BoxProps, MenuItem, Typography } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { IHopDongHangMucTramForm } from 'src/@types/hopdong';
import { IHopDongForm } from 'src/@types/hopdongmatbang';
import { RHFSelect } from 'src/components/hook-form';
import { useDmLoaiHangMucCshtsQuery } from 'src/data/dmLoaiHangMucCsht';

type Props = BoxProps & {
  indexHangMuc: number;
  filedHangMuc: IHopDongHangMucTramForm;
};

const LoaiHangMucCshtField = ({ indexHangMuc, filedHangMuc, ...boxProps }: Props) => {
  const { data } = useDmLoaiHangMucCshtsQuery({ refetchOnWindowFocus: false });
  const { setValue } = useFormContext<IHopDongForm>();
  return (
    <Box sx={{ width: '100%' }} {...boxProps}>
      <Typography variant="overline" component="p" gutterBottom sx={{ textTransform: 'none' }}>
        Loại hạng mục CSHT{' '}
        <span style={{ color: '#FF0000' }}>{filedHangMuc.isDungChung ? '(*)' : ''}</span>
      </Typography>
      <RHFSelect
        name={`hangMucs.${indexHangMuc}.loaiHangMucCsht.id`}
        hiddenLabel
        onChange={(e) => {
          const id = Number(e.target.value);
          const ten = data?.elements.find((dt) => dt.id === id)?.ten || '';
          setValue(`hangMucs.${indexHangMuc}.loaiHangMucCsht`, { id, ten });
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

export default LoaiHangMucCshtField;
