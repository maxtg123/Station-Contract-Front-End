import { Container } from '@mui/material';
import Head from 'next/head';
import ComingSoon from 'src/components/coming-soon';
import { useSettingsContext } from 'src/components/settings';
import DashboardLayout from 'src/layouts/dashboard/DashboardLayout';

// ----------------------------------------------------------------------
BaoCaoPage.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

export default function BaoCaoPage() {
  const { themeStretch } = useSettingsContext();
  return (
    <>
      <Head>
        <title>Hợp đồng mặt bằng | Báo Cáo </title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'xl'} style={{ height: '100%' }}>
        {/* <Typography variant="h3" component="h1" paragraph>
                    Báo cáo
                </Typography> */}

        <ComingSoon />
      </Container>
    </>
  );
}
