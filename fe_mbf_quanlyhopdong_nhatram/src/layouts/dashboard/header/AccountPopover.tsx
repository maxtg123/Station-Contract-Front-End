import Cookies from 'js-cookie';
import { useState } from 'react';
// next
import { useRouter } from 'next/router';
// @mui
import { Box, Divider, MenuItem, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
// routes
import { AUTH_CRED, AUTH_CRED_PROFILE } from 'src/constants/auth.constant';
import { DRAG_HOP_DONG_COL } from 'src/constants/hopdongmatbang.constant';
import { DRAG_HOP_DONG_XA_HOI_HOA_COL } from 'src/constants/hopdongxahoihoa.constant';
import useAuthCredentials from 'src/hooks/useAuthCredentials';
import { PATH_AUTH } from '../../../routes/paths';
// auth
// components
import { IconButtonAnimate } from '../../../components/animate';
import { CustomAvatar } from '../../../components/custom-avatar';
import MenuPopover from '../../../components/menu-popover';
import { useSnackbar } from '../../../components/snackbar';

// ----------------------------------------------------------------------

const OPTIONS = [
  {
    label: 'Trang chủ',
    linkTo: '/',
  },
  {
    label: 'Cài đặt hệ thống',
    linkTo: '/settings/remind/',
  },
  {
    label: 'Cài đặt phân quyền',
    linkTo: '/configuration/chuc-vu/',
  },
];
const DRAG_TRAM_COL = 'dragColumnTram';
// ----------------------------------------------------------------------

export default function AccountPopover() {
  const { replace, push } = useRouter();

  const { profile, isAdmin, pdChinh } = useAuthCredentials();

  const { enqueueSnackbar } = useSnackbar();

  const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);

  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const handleLogout = async () => {
    try {
      Cookies.remove(AUTH_CRED);
      localStorage.removeItem(AUTH_CRED_PROFILE);
      localStorage.removeItem(DRAG_TRAM_COL);
      localStorage.removeItem(DRAG_HOP_DONG_COL);
      localStorage.removeItem(DRAG_HOP_DONG_XA_HOI_HOA_COL);
      // dispatch({ type: 'clear-auth-profile' });
      localStorage.clear();
      replace(PATH_AUTH.login);
      handleClosePopover();
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Unable to logout!', { variant: 'error' });
    }
  };

  const handleClickItem = (path: string) => {
    handleClosePopover();
    push(path);
  };

  return (
    <>
      <IconButtonAnimate
        onClick={handleOpenPopover}
        sx={{
          p: 0,
          ...(openPopover && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <CustomAvatar name={profile?.email} />
      </IconButtonAnimate>

      <MenuPopover open={openPopover} onClose={handleClosePopover} sx={{ width: 200, p: 0 }}>
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {profile?.hoTen}
          </Typography>

          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {profile?.email}
          </Typography>

          {!isAdmin && (
            <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
              {pdChinh?.chucVu?.ten}
            </Typography>
          )}
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          {OPTIONS.map((option) => (
            <MenuItem key={option.label} onClick={() => handleClickItem(option.linkTo)}>
              {option.label}
            </MenuItem>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={handleLogout} sx={{ m: 1 }}>
          Đăng xuất
        </MenuItem>
      </MenuPopover>
    </>
  );
}
