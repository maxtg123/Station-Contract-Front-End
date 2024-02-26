import { Box, Card, CircularProgress, Container, Divider, Fab, Tab, Tabs } from '@mui/material';
import Head from 'next/head';
import { ReactNode, useEffect, useState } from 'react';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/CustomBreadcrumbs';
import Iconify from 'src/components/iconify/Iconify';
import { LabelColor } from 'src/components/label';
import Label from 'src/components/label/Label';
import { useSettingsContext } from 'src/components/settings';
import { HopDongFilterProvider } from 'src/context/hop-dong-mat-bang/hopDongFilterContext';
import { ListHopDongProvider } from 'src/context/hop-dong-mat-bang/listHopDongContext';
import { useHopDongQuery } from 'src/data/hopDongMatBang';
import DashboardLayout from 'src/layouts/dashboard/DashboardLayout';
import { PATH_DASHBOARD, PATH_HOP_DONG_MAT_BANG } from 'src/routes/paths';
import HopDongCanDamPhan from 'src/sections/hopdongmatbang/giaoviec/tabs-giao-viec/tab-hop-dong-can-dam-phan';
import TabActiveDraft from 'src/sections/hopdongmatbang/tabs-hop-dong/tab-active-draft';

// ----------------------------------------------------------------------
GiaoViecPage.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

type ITab = {
  value: 'active' | 'da_duoc_giao_viec' | 'viec_can_lam';
  label: string;
  component: ReactNode;
  count: number;
  color: LabelColor;
  isLoading?: boolean;
};

const TABS: ITab[] = [
  {
    value: 'active',
    label: 'Hợp đồng sắp hết hạn',
    component: <TabActiveDraft type="active" module="GIAO_VIEC" />,
    count: 0,
    color: 'success',
    isLoading: true,
  },
  // {
  //   value: 'da_duoc_giao_viec',
  //   label: 'Hợp đồng đã được giao việc',
  //   component: <HopDongDaDuocGiaoViec />,
  //   count: 0,
  //   color: 'warning',
  //   isLoading: false,
  // },
  {
    value: 'viec_can_lam',
    label: 'Hợp đồng cần đàm phán',
    component: <HopDongCanDamPhan />,
    count: 0,
    color: 'error',
    isLoading: false,
  },
];

export default function GiaoViecPage() {
  const { themeStretch } = useSettingsContext();
  const [tabs, setTabs] = useState<ITab[]>(TABS);
  const [tabValue, setTabValue] = useState('active');
  const handleChangeTab = (event: React.SyntheticEvent<Element, Event>, newValue: string) => {
    setTabValue(newValue);
  };
  const { data: listHopDongHienHuu } = useHopDongQuery(
    {
      page: 0,
      size: 1,
      trangThaiHopDong: 'SAP_HET_HAN',
      loaiHopDong: 'MAT_BANG',
      countOnly: 1,
    },
    { refetchOnWindowFocus: false }
  );
  const { data: listHopDongCanDamPhan } = useHopDongQuery(
    {
      page: 0,
      size: 1,
      trangThaiHopDong: 'VIEC_CAN_LAM',
      loaiHopDong: 'MAT_BANG',
      countOnly: 1,
    },
    { refetchOnWindowFocus: false }
  );
  useEffect(() => {
    if (listHopDongHienHuu?.metadata) {
      setTabs((prevTabs) => {
        const updatedTabs = [...prevTabs];
        updatedTabs[0].count = listHopDongHienHuu.metadata.total;
        updatedTabs[0].isLoading = false;
        return updatedTabs;
      });
    }
  }, [listHopDongHienHuu]);

  useEffect(() => {
    if (listHopDongCanDamPhan?.metadata) {
      setTabs((prevTabs) => {
        const updatedTabs = [...prevTabs];
        updatedTabs[1].count = listHopDongCanDamPhan.metadata.total;
        updatedTabs[1].isLoading = false;
        return updatedTabs;
      });
    }
  }, [listHopDongCanDamPhan]);
  return (
    <>
      <Head>
        <title>Hợp đồng mặt bằng | Giao việc</title>
      </Head>
      <ListHopDongProvider>
        <HopDongFilterProvider>
          <Container maxWidth={themeStretch ? false : 'xl'}>
            <CustomBreadcrumbs
              heading="Danh sách giao việc"
              links={[
                { name: 'Quản lý hợp đồng nhà trạm', href: PATH_DASHBOARD.root },
                { name: 'Hợp đồng mặt bằng', href: PATH_HOP_DONG_MAT_BANG.root },
                { name: 'Đàm phán' },
              ]}
              action={
                <Fab sx={{ width: '40px', height: '40px' }} onClick={() => {}}>
                  <Iconify icon="eva:plus-fill" />
                </Fab>
              }
            />
            <Card>
              <Tabs
                value={tabValue}
                onChange={handleChangeTab}
                sx={{
                  px: 2,
                  bgcolor: 'background.neutral',
                }}
              >
                {tabs.map((tab) => (
                  <Tab
                    key={tab.value}
                    value={tab.value}
                    label={tab.label}
                    icon={
                      <Label color={tab.color} sx={{ mr: 1 }}>
                        {tab.isLoading ? <CircularProgress size={16} /> : tab.count}
                      </Label>
                    }
                  />
                ))}
              </Tabs>
              <Divider />
              {tabs.map(
                (tab) =>
                  tab.value === tabValue && (
                    <Box key={tab.value} sx={{ mt: 1 }}>
                      {tab.component}
                    </Box>
                  )
              )}
            </Card>
          </Container>
        </HopDongFilterProvider>
      </ListHopDongProvider>
    </>
  );
}
