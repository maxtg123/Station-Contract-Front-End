import { Button } from '@mui/material';
import Iconify from 'src/components/iconify/Iconify';

type Props = {
  onThemMoi: VoidFunction;
};
const ThemMoi = ({ onThemMoi }: Props) => {
  return (
    <Button onClick={onThemMoi} sx={{ justifyContent: 'flex-start' }}>
      <Iconify icon="eva:plus-fill" />
      <span style={{ marginLeft: 10, textTransform: 'none' }}>Thêm mới nội dung đàm phán</span>
    </Button>
  );
};

export default ThemMoi;
