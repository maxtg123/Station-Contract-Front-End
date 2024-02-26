import { Box, Typography } from '@mui/material';
import { IHopDongHangMucTramForm } from 'src/@types/hopdong';
import { RHFTextField } from 'src/components/hook-form';

type Props = {
  index: number;
  fieldHangMuc: IHopDongHangMucTramForm;
};

const MaTramErpField = ({ index, fieldHangMuc }: Props) => {
  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="overline" component="p" gutterBottom sx={{ textTransform: 'none' }}>
        Mã trạm ERP
      </Typography>
      <RHFTextField
        name={`hangMucs.${index}.tram.maErp`}
        hiddenLabel
        fullWidth
        disabled
        variant="filled"
        value={fieldHangMuc.tram.maErp}
      />
    </Box>
  );
};

export default MaTramErpField;
