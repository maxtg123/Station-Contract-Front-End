import { IconButton } from '@mui/material';
import Iconify from 'src/components/iconify/Iconify';
import PermissionWrapper from 'src/components/permission-wrapper';

type Props = {
  openPopover: HTMLElement | null;
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
};
const CellAction = ({ openPopover, onClick }: Props) => {
  return (
    <PermissionWrapper module="DANH_MUC" action="CAP_NHAT" hideWhenBlocked checkAt="atLeastPD">
      <IconButton color={openPopover ? 'inherit' : 'default'} onClick={onClick}>
        <Iconify icon="eva:more-vertical-fill" />
      </IconButton>
    </PermissionWrapper>
  );
};

export default CellAction;
