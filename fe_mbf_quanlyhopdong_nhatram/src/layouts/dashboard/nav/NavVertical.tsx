import { useEffect } from 'react';
// next
import { useRouter } from 'next/router';
// @mui
import { Box, Drawer, Stack } from '@mui/material';
// hooks
import { useSettingsContext } from 'src/components/settings';
import useResponsive from '../../../hooks/useResponsive';
// config
import { NAV } from '../../../config-global';
// components
import Logo, { LogoFull } from '../../../components/logo';
import { NavSectionVertical } from '../../../components/nav-section';
import Scrollbar from '../../../components/scrollbar';
//
import NavAccount from './NavAccount';
import NavToggleButton from './NavToggleButton';
import navConfig from './config-navigation';

// ----------------------------------------------------------------------

type Props = {
  openNav: boolean;
  onCloseNav: VoidFunction;
};

export default function NavVertical({ openNav, onCloseNav }: Props) {
  const { pathname } = useRouter();
  const { themeLayout } = useSettingsContext();
  const isDesktop = useResponsive('up', 'lg');
  const isNavMini = themeLayout === 'mini';
  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': {
          height: 1,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Stack
        spacing={3}
        sx={{
          pt: 3,
          pb: 2,
          px: 2.5,
          flexShrink: 0,
        }}
      >
        {isNavMini ? <Logo /> : <LogoFull />}
        <NavAccount />
      </Stack>

      <NavSectionVertical data={navConfig} />

      <Box sx={{ flexGrow: 1 }} />
    </Scrollbar>
  );

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.W_DASHBOARD },
      }}
    >
      <NavToggleButton />

      {isDesktop ? (
        <Drawer
          open
          variant="permanent"
          PaperProps={{
            sx: {
              zIndex: 0,
              width: NAV.W_DASHBOARD,
              // backgroundColor: '#F9FAFB',
              // ...bgGradient({
              //   direction: 'to bottom',
              //   startColor: `${theme.palette.primary.dark}`,
              //   endColor: `${theme.palette.primary.main} 100%`,
              // }),
              // borderColor: '#355BD5',
              borderRightStyle: 'dashed',
            },
          }}
        >
          {renderContent}
        </Drawer>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          ModalProps={{
            keepMounted: true,
          }}
          PaperProps={{
            sx: {
              width: NAV.W_DASHBOARD,
              // backgroundColor: '#2586CA',
              // borderColor: '#355BD5',
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}
