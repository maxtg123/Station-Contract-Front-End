// next
import Head from 'next/head';
import { Container, Typography } from '@mui/material';
// layouts
import DashboardLayout from '../../layouts/dashboard';
// components
import { useSettingsContext } from '../../components/settings';
import ComingSoon from 'src/components/coming-soon';

// ----------------------------------------------------------------------

NhacNhoPage.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function NhacNhoPage() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Head>
        <title>Nhắc nhở</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'xl'} style={{ height: '100%' }}>
        {/* <Typography variant="h3" component="h1" paragraph>
          Nhắc nhở
        </Typography> */}

        <ComingSoon />
      </Container>
    </>
  );
}
