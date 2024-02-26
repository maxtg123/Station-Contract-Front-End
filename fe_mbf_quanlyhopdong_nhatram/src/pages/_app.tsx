// i18n
import '../locales/i18n';

// scroll bar
import 'simplebar/src/simplebar.css';

// lightbox
import 'yet-another-react-lightbox/plugins/captions.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import 'yet-another-react-lightbox/styles.css';

// lazy image
import 'react-lazy-load-image-component/src/effects/blur.css';

// ----------------------------------------------------------------------

import { CacheProvider, EmotionCache } from '@emotion/react';
// next
import { NextPage } from 'next';
import { AppProps } from 'next/app';
import Head from 'next/head';
// utils
import { LocalizationProvider as LocalizationMuiDatePickerProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import vi from 'date-fns/locale/vi';
import { useState } from 'react';
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query';
import { TienTrinhProvider } from 'src/context/tien-trinh/TienTrinhContext';
import createEmotionCache from '../utils/createEmotionCache';
// theme
import ThemeProvider from '../theme';
// locales
import ThemeLocalization from '../locales';
// components
import { MotionLazyContainer } from '../components/animate';
import ProgressBar from '../components/progress-bar';
import { SettingsProvider, ThemeSettings } from '../components/settings';
import SnackbarProvider from '../components/snackbar';
import '../assets/global.css';
// ----------------------------------------------------------------------

const clientSideEmotionCache = createEmotionCache();

type NextPageWithLayout = NextPage & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
  Component: NextPageWithLayout;
}

export default function MyApp(props: MyAppProps) {
  const { Component, pageProps, emotionCache = clientSideEmotionCache } = props;

  const getLayout = Component.getLayout ?? ((page) => page);

  const [queryClient] = useState(() => new QueryClient());

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>

      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          {/* <AuthProvider> */}
          <LocalizationMuiDatePickerProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
            <SettingsProvider>
              <MotionLazyContainer>
                <ThemeProvider>
                  <TienTrinhProvider>
                    <ThemeSettings>
                      <ThemeLocalization>
                        <SnackbarProvider>
                          <ProgressBar />
                          {getLayout(<Component {...pageProps} />)}
                        </SnackbarProvider>
                      </ThemeLocalization>
                    </ThemeSettings>
                  </TienTrinhProvider>
                </ThemeProvider>
              </MotionLazyContainer>
            </SettingsProvider>
          </LocalizationMuiDatePickerProvider>
          {/* </AuthProvider> */}
        </Hydrate>
      </QueryClientProvider>
    </CacheProvider>
  );
}
