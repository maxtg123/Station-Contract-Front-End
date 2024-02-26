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
        <title>Hợp đồng xã hội hóa | Báo Cáo </title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'xl'} style={{ height: '100%' }}>
        <ComingSoon />
      </Container>
    </>
  );
}
