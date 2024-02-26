import { Box } from '@mui/material';
import { RHFCheckbox } from 'src/components/hook-form';

type Props = {
  indexHangMuc: number;
};
const IsDungChungFiled = ({ indexHangMuc }: Props) => {
  return (
    <Box sx={{ width: '100%', display: 'flex', m: 2 }} justifyContent="flex-start">
      <RHFCheckbox
        name={`hangMucs.${indexHangMuc}.isDungChung`}
        label="Có dùng chung"
        sx={{ mr: 0 }}
      />
    </Box>
  );
};

export default IsDungChungFiled;
