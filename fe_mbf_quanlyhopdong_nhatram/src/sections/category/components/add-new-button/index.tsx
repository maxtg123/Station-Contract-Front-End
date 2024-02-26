import { Fab } from '@mui/material';
import Iconify from 'src/components/iconify/Iconify';
import PermissionWrapper from 'src/components/permission-wrapper';

type Props = {
  onOpenPopover: (event: React.MouseEvent<HTMLElement>) => void;
};

const AddNewButtonDanhMuc = ({ onOpenPopover }: Props) => {
  return (
    <PermissionWrapper module="DANH_MUC" action="THEM_MOI" hideWhenBlocked checkAt="atLeastPD">
      <Fab sx={{ width: '40px', height: '40px' }} onClick={onOpenPopover}>
        <Iconify icon="eva:plus-fill" />
      </Fab>
    </PermissionWrapper>
  );
};

export default AddNewButtonDanhMuc;
