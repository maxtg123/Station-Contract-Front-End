// next
import Head from 'next/head';
import { Container, Typography } from '@mui/material';
// layouts
import DashboardLayout from '../../layouts/dashboard';
// components
import { useSettingsContext } from '../../components/settings';
import ComingSoon from 'src/components/coming-soon';

// ----------------------------------------------------------------------

ThoiGianPage.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function ThoiGianPage() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Head>
        <title>Thời gian</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'xl'} style={{ height: '100%' }}>
        {/* <Typography variant="h3" component="h1" paragraph>
          Thời gian
        </Typography> */}

        <ComingSoon />
      </Container>
    </>
  );
}
