import { Container } from '@mui/material';
import equal from 'fast-deep-equal';
import isNil from 'lodash/isNil';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { IHopDong } from 'src/@types/hopdongmatbang';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/CustomBreadcrumbs';
import { useSettingsContext } from 'src/components/settings';
import { ChiTietHopDongProvider } from 'src/context/hop-dong/chitietHopDongContext';
import { useHopDongDetailQuery } from 'src/data/hopDongMatBang';
import DashboardLayout from 'src/layouts/dashboard/DashboardLayout';
import { PATH_DASHBOARD, PATH_HOP_DONG_XA_HOI_HOA } from 'src/routes/paths';
import ChiTietHopDongPage from 'src/sections/components/hop-dong/chi-tiet-hop-dong/ChiTietHopDongPage';
// ----------------------------------------------------------------------

HopDongXaHoiHoaDetailPage.getLayout = (page: React.ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default function HopDongXaHoiHoaDetailPage() {
  const { themeStretch } = useSettingsContext();

  const [newData, setNewData] = useState<IHopDong | null>(null);

  const {
    query: { id },
    isReady,
  } = useRouter();

  const { data, isLoading, isError } = useHopDongDetailQuery(id ? Number(id) : 0, {
    refetchOnWindowFocus: false,
    enabled: !!(isReady && id),
  });

  useEffect(() => {
    if (!isLoading && !isError && !isNil(data) && !equal(data, newData)) {
      setNewData(data?.elements[0]);
    }
  }, [isLoading, isError, data, newData]);

  return (
    <>
      <Head>
        <title>Hợp đồng xã hội hóa | Chi tiết</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Chi tiết hợp đồng xã hội hóa"
          links={[
            { name: 'Quản lý hợp đồng nhà trạm', href: PATH_DASHBOARD.root },
            { name: 'Danh sách hợp đồng xã hội hóa', href: PATH_HOP_DONG_XA_HOI_HOA.root },
            { name: `${newData?.soHopDong}` },
          ]}
        />

        <ChiTietHopDongProvider>
          <ChiTietHopDongPage type="XA_HOI_HOA" />
        </ChiTietHopDongProvider>
      </Container>
    </>
  );
}
