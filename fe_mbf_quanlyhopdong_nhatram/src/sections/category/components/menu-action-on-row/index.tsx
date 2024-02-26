import { Divider, MenuItem } from '@mui/material';
import Iconify from 'src/components/iconify/Iconify';
import MenuPopover from 'src/components/menu-popover/MenuPopover';
import PermissionWrapper from 'src/components/permission-wrapper';

type Props = {
  openPopover: HTMLElement | null;
  onDelete: VoidFunction;
  onEdit: VoidFunction;
  onClosePopover: VoidFunction;
};
const MenuActionOnRowDanhMuc = ({ openPopover, onDelete, onEdit, onClosePopover }: Props) => {
  return (
    <PermissionWrapper module="DANH_MUC" action="CAP_NHAT" hideWhenBlocked checkAt="atLeastPD">
      <MenuPopover
        open={openPopover}
        onClose={onClosePopover}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            onEdit();
          }}
        >
          <Iconify icon="eva:edit-fill" />
          Chỉnh sửa
        </MenuItem>
        <Divider sx={{ borderStyle: 'dashed' }} />
        <MenuItem
          onClick={() => {
            onDelete();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="eva:trash-2-outline" />
          Xóa
        </MenuItem>
      </MenuPopover>
    </PermissionWrapper>
  );
};

export default MenuActionOnRowDanhMuc;
