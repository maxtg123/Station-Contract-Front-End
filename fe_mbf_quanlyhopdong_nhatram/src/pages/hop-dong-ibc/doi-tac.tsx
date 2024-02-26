import { Container } from '@mui/material';
import Head from 'next/head';
import ComingSoon from 'src/components/coming-soon';
import { useSettingsContext } from 'src/components/settings';
import DashboardLayout from 'src/layouts/dashboard/DashboardLayout';

// ----------------------------------------------------------------------
DoiTacPage.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

export default function DoiTacPage() {
  const { themeStretch } = useSettingsContext();
  return (
    <>
      <Head>
        <title>Hợp đồng IBC | Đối tác</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'xl'} style={{ height: '100%' }}>
        <ComingSoon />
      </Container>
    </>
  );
}
