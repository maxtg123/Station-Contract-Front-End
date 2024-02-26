// @mui
import { AppBar, IconButton, Stack, Toolbar } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { IThongBao } from 'src/@types/thongbao';
// utils
import { bgBlur } from '../../../utils/cssStyles';
// hooks
import useOffSetTop from '../../../hooks/useOffSetTop';
import useResponsive from '../../../hooks/useResponsive';
// config
import { HEADER, NAV } from '../../../config-global';
// components
import Iconify from '../../../components/iconify';
import Logo, { LogoFull } from '../../../components/logo';
import { useSettingsContext } from '../../../components/settings';
//
import AccountPopover from './AccountPopover';
import NotificationsPopover from './NotificationsPopover';
import Searchbar from './Searchbar';

// ----------------------------------------------------------------------

type Props = {
  onOpenNav?: VoidFunction;
  data: IThongBao[];
  totalThongBaoChuaXem: number;
};

export default function Header({ onOpenNav, data, totalThongBaoChuaXem }: Props) {
  const theme = useTheme();

  const { themeLayout } = useSettingsContext();

  const isNavHorizontal = themeLayout === 'horizontal';

  const isNavMini = themeLayout === 'mini';

  const isDesktop = useResponsive('up', 'lg');

  const isOffset = useOffSetTop(HEADER.H_DASHBOARD_DESKTOP) && !isNavHorizontal;

  const renderContent = (
    <>
      {isDesktop &&
        isNavHorizontal &&
        (isNavMini ? <Logo sx={{ mr: 2.5 }} /> : <LogoFull sx={{ mr: 2.5 }} />)}
      {!isDesktop && (
        <IconButton onClick={onOpenNav} sx={{ mr: 1, color: 'text.primary' }}>
          <Iconify icon="eva:menu-2-fill" />
        </IconButton>
      )}

      <Searchbar />

      <Stack
        flexGrow={1}
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        spacing={{ xs: 0.5, sm: 1.5 }}
      >
        <NotificationsPopover data={data} totalThongBaoChuaXem={totalThongBaoChuaXem} />
        <AccountPopover />
      </Stack>
    </>
  );

  return (
    <AppBar
      sx={{
        // boxShadow: 'none',
        height: HEADER.H_MOBILE,
        zIndex: theme.zIndex.appBar + 1,
        ...bgBlur({
          color: theme.palette.background.default,
        }),
        transition: theme.transitions.create(['height'], {
          duration: theme.transitions.duration.shorter,
        }),
        ...(isDesktop && {
          width: `calc(100% - ${NAV.W_DASHBOARD + 1}px)`,
          height: HEADER.H_DASHBOARD_DESKTOP,
          ...(isOffset && {
            height: HEADER.H_DASHBOARD_DESKTOP_OFFSET,
          }),
          ...(isNavHorizontal && {
            width: 1,
            // bgcolor: 'background.default',
            height: HEADER.H_DASHBOARD_DESKTOP_OFFSET,
            borderBottom: `dashed 1px ${theme.palette.divider}`,
          }),
          ...(isNavMini && {
            width: `calc(100% - ${NAV.W_DASHBOARD_MINI + 1}px)`,
          }),
        }),
        backgroundColor: 'white',
        // background:
        //   'linear-gradient(90deg, rgba(0,97,186,1) 0%, rgba(254,38,38,0.5943627450980392) 100%)',
      }}
    >
      <Toolbar
        sx={{
          height: 1,
          px: { lg: 5 },
        }}
      >
        {renderContent}
      </Toolbar>
    </AppBar>
  );
}
