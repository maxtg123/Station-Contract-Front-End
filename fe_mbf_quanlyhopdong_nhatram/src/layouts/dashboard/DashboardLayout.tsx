import { Box, CircularProgress } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useState } from 'react';
import { useInterval } from 'react-use';
import { IBgProcess } from 'src/@types/process';
import { LOCAL_STORAGE, NAV } from 'src/config-global';
import { useTienTrinhContext } from 'src/context/tien-trinh/TienTrinhContext';
import { tienTrinhClient } from 'src/data/client/tienTrinh';
import { useThongBaosQuery, useTotalThongBaoChuaXemQuery } from 'src/data/thongbao';
import { removeBgProcess } from 'src/utils/bgProcessLocalStorage';
import AuthGuard from '../../auth/AuthGuard';
import { useSettingsContext } from '../../components/settings';
import useResponsive from '../../hooks/useResponsive';
import Main from './Main';
import Footer from './footer/Footer';
import Header from './header';
import NavHorizontal from './nav/NavHorizontal';
import NavMini from './nav/NavMini';
import NavVertical from './nav/NavVertical';

// ----------------------------------------------------------------------

type Props = {
  children?: React.ReactNode;
};

export default function DashboardLayout({ children }: Props) {
  const [bgProcesses, setBgProcesses] = useState<IBgProcess[]>([]);

  const [page] = useState(0);

  const { themeLayout } = useSettingsContext();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const isDesktop = useResponsive('up', 'lg');

  const [open, setOpen] = useState(false);

  const isNavHorizontal = themeLayout === 'horizontal';

  const isNavMini = themeLayout === 'mini';

  const { dispatch } = useTienTrinhContext();
  const { data: listThongBao } = useThongBaosQuery(
    {
      size: 5,
      page,
    },
    { refetchOnWindowFocus: true }
  );
  const { data: totalThongBaoChuaXem } = useTotalThongBaoChuaXemQuery({
    refetchOnWindowFocus: true,
  });
  useInterval(
    async () => {
      bgProcesses.forEach((process) => {
        tienTrinhClient
          .tienTrinh(process.id)
          .then((res) => {
            const dataRes = res?.elements?.[0];
            if (!res.elements[0].ketThuc) {
              return;
            }
            if (res?.elements?.[0].soLuongLoi > 0) {
              const data = res.elements[0];
              dispatch({
                type: 'set-tien-trinh',
                payload: {
                  id: process.id,
                  status: 'error',
                  message: process.messageError,
                  tongSo: data.tongSo,
                  hoanThanh: data.hoanThanh,
                  soLuongLoi: data.soLuongLoi,
                },
              });
              enqueueSnackbar(process.messageError, {
                variant: 'error',
                persist: true,
              });
            } else {
              dispatch({
                type: 'set-tien-trinh',
                payload: {
                  id: process.id,
                  status: 'success',
                  message: process.messageSuccess,
                  tongSo: dataRes.tongSo,
                  hoanThanh: dataRes.hoanThanh,
                  soLuongLoi: dataRes.soLuongLoi,
                },
              });
              enqueueSnackbar(process.messageSuccess, {
                variant: 'success',
                persist: true,
              });
              tienTrinhClient
                .deleteTienTrinh(process.id)
                .then(() => {})
                .catch(() => {});
            }
            closeSnackbar(process.id);
            removeBgProcess(process.id);
          })
          .catch((e) => {
            console.log('e: ', e);
            enqueueSnackbar(process.messageError, {
              variant: 'error',
              persist: true,
            });
            closeSnackbar(process.id);
            removeBgProcess(process.id);
            tienTrinhClient
              .deleteTienTrinh(process.id)
              .then(() => {})
              .catch(() => {});
          });
      });
    },
    bgProcesses.length > 0 ? 5 * 1000 : null
  );

  const bgProcessingCb = useCallback(() => {
    bgProcesses.forEach((p) => {
      enqueueSnackbar(p.messageLoading, {
        variant: 'info',
        action: (
          <Box>
            <CircularProgress sx={{ display: 'inline' }} />
          </Box>
        ),
        persist: true,
        disableWindowBlurListener: !!p.messageLoading,
        key: p.id,
      });
    });
  }, [bgProcesses, enqueueSnackbar]);

  useEffect(bgProcessingCb, [bgProcessingCb]);

  useEffect(() => {
    function handleChangeStorage() {
      const bgProcess: string | null = localStorage.getItem(LOCAL_STORAGE.BG_PROCESS);
      setBgProcesses(bgProcess ? JSON.parse(bgProcess) : []);
    }

    window.addEventListener('storage', handleChangeStorage, false);
    return () => window.removeEventListener('storage', handleChangeStorage);
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const renderNavVertical = <NavVertical openNav={open} onCloseNav={handleClose} />;

  const renderContent = () => {
    if (isNavHorizontal) {
      return (
        <>
          <Header
            onOpenNav={handleOpen}
            data={listThongBao?.elements || []}
            totalThongBaoChuaXem={totalThongBaoChuaXem ?? 0}
          />

          {isDesktop ? <NavHorizontal /> : renderNavVertical}

          <Main>{children}</Main>

          <Footer />
        </>
      );
    }
    if (isNavMini) {
      return (
        <Box display="flex" flexDirection="column" height={1}>
          <Header
            onOpenNav={handleOpen}
            data={listThongBao?.elements || []}
            totalThongBaoChuaXem={totalThongBaoChuaXem ?? 0}
          />

          <Box
            sx={{
              flexGrow: 1,
              display: { lg: 'flex' },
              // minHeight: { lg: 1 },
            }}
          >
            {isDesktop ? <NavMini /> : renderNavVertical}

            <Main>{children}</Main>
          </Box>

          <Footer ml={`${NAV.W_DASHBOARD_MINI}px`} />
        </Box>
      );
    }
    return (
      <Box display="flex" flexDirection="column" height={1}>
        <Header
          onOpenNav={handleOpen}
          data={listThongBao?.elements || []}
          totalThongBaoChuaXem={totalThongBaoChuaXem ?? 0}
        />

        <Box
          sx={{
            flexGrow: 1,
            display: { lg: 'flex' },
            // minHeight: { lg: 1 },
          }}
        >
          {renderNavVertical}

          <Main>{children}</Main>
        </Box>
        <Footer ml={`${NAV.W_DASHBOARD}px`} />
      </Box>
    );
  };

  return <AuthGuard>{renderContent()}</AuthGuard>;
}
