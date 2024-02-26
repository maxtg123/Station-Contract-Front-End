// next
import Head from 'next/head';
import { Container, Typography } from '@mui/material';
// layouts
import DashboardLayout from '../../layouts/dashboard';
// components
import { useSettingsContext } from '../../components/settings';
import ComingSoon from 'src/components/coming-soon';

// ----------------------------------------------------------------------

ChuKyPage.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function ChuKyPage() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Head>
        <title>Chu kỳ</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'xl'} style={{ height: '100%' }}>
        {/* <Typography variant="h3" component="h1" paragraph>
          Chu kỳ
        </Typography> */}

        <ComingSoon />
      </Container>
    </>
  );
}
