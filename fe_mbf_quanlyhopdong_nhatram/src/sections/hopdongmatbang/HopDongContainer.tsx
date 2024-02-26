import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  CircularProgress,
  Container,
  Divider,
  Fab,
  MenuItem,
  Stack,
  Tab,
  Tabs,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ReactNode, useEffect, useState } from 'react';
import { IHopDong } from 'src/@types/hopdongmatbang';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/CustomBreadcrumbs';
import Iconify from 'src/components/iconify/Iconify';
import { LabelColor } from 'src/components/label';
import Label from 'src/components/label/Label';
import MenuPopover from 'src/components/menu-popover';
import PermissionBgProcessWrapper from 'src/components/permission-bg-process-wrapper';
import Scrollbar from 'src/components/scrollbar/Scrollbar';
import { useSettingsContext } from 'src/components/settings';
import { CreateHopDongProvider } from 'src/context/hop-dong-mat-bang/createHopDongContext';
import { useHopDongFilterContext } from 'src/context/hop-dong-mat-bang/hopDongFilterContext';
import { ITabValue, useListHopDongContext } from 'src/context/hop-dong-mat-bang/listHopDongContext';
import { useHopDongQuery } from 'src/data/hopDongMatBang';
import useAuthCredentials from 'src/hooks/useAuthCredentials';
import { PATH_DASHBOARD, PATH_HOP_DONG_MAT_BANG } from 'src/routes/paths';
import TabActiveDraft from './tabs-hop-dong/tab-active-draft';
import TabCanPheDuyet from './tabs-hop-dong/tab-can-phe-duyet/TabCanPheDuyet';
import TabDaGuiPheDuyet from './tabs-hop-dong/tab-da-gui-phe-duyet/TabDaGuiPheDuyet';
import ThanhToanAnalytic from './thanhtoan/ThanhToanAnalytic';

const HopDongImport = dynamic(() => import('./HopDongImport'), { ssr: false });
const HopDongSidebar = dynamic(() => import('./HopDongSidebar'), { ssr: false });
const ConfirmDialog = dynamic(() => import('src/components/confirm-dialog/ConfirmDialog'), {
  ssr: false,
});
type ITab = {
  value: ITabValue;
  label: string;
  component: ReactNode;
  count: number;
  color: LabelColor;
  isLoading?: boolean;
};

const TABS: ITab[] = [
  {
    value: 'active',
    label: 'Hợp đồng hiện hữu',
    component: <TabActiveDraft type="active" module="HOP_DONG" />,
    count: 0,
    color: 'success',
    isLoading: true,
  },
  {
    value: 'chua_gui_phe_duyet',
    label: 'Chưa gửi phê duyệt',
    component: <TabActiveDraft type="draft" />,
    count: 0,
    color: 'primary',
    isLoading: true,
  },
  {
    value: 'da_gui_phe_duyet',
    label: 'Đã gửi phê duyệt',
    component: <TabDaGuiPheDuyet />,
    count: 0,
    color: 'warning',
    isLoading: true,
  },
  {
    value: 'can_phe_duyet',
    label: 'Cần phê duyệt',
    component: <TabCanPheDuyet />,
    count: 0,
    color: 'error',
  },
];

const WIDTH_MENU_POPOVER = 177;

export default function HopDongContainer() {
  const { allQuyen } = useAuthCredentials();
  const theme = useTheme();
  const {
    dispatch,
    state: { activeTab },
  } = useListHopDongContext();
  const { dispatch: dispatchFilter } = useHopDongFilterContext();
  const { data: listHopDongHienHuu } = useHopDongQuery(
    {
      page: 0,
      size: 1,
      trangThaiHopDong: 'HOAT_DONG',
      loaiHopDong: 'MAT_BANG',
      countOnly: 1,
    },
    { refetchOnWindowFocus: false }
  );
  const { data: listHopDongNhap } = useHopDongQuery(
    {
      page: 0,
      size: 1,
      trangThaiHopDong: 'NHAP',
      loaiHopDong: 'MAT_BANG',
      countOnly: 1,
    },
    { refetchOnWindowFocus: false }
  );
  const { data: listHopDongDaGuiPheDuyet } = useHopDongQuery(
    {
      page: 0,
      size: 1,
      trangThaiHopDong: 'CHO_PHE_DUYET',
      loaiHopDong: 'MAT_BANG',
      countOnly: 1,
    },
    { refetchOnWindowFocus: false }
  );
  const { data: listHopDongCanPheDuyet } = useHopDongQuery(
    {
      page: 0,
      size: 1,
      trangThaiHopDong: 'CAN_PHE_DUYET',
      loaiHopDong: 'MAT_BANG',
      countOnly: 1,
    },
    { refetchOnWindowFocus: false }
  );
  const { data: hdCanThanhToan } = useHopDongQuery(
    {
      page: 0,
      size: 1,
      trangThaiHopDong: 'HOAT_DONG',
      loaiHopDong: 'MAT_BANG',
      countOnly: 1,
      tinhTrangThanhToan: 'CAN_THANH_TOAN',
    },
    { refetchOnWindowFocus: false }
  );
  const { data: hdQuaHan } = useHopDongQuery(
    {
      page: 0,
      size: 1,
      trangThaiHopDong: 'HOAT_DONG',
      loaiHopDong: 'MAT_BANG',
      countOnly: 1,
      tinhTrangThanhToan: 'QUA_HAN',
    },
    { refetchOnWindowFocus: false }
  );

  const { themeStretch } = useSettingsContext();

  const [tabs, setTabs] = useState<ITab[]>(TABS);
  const [openSidebar, setOpenSidebar] = useState(false);
  const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);
  const [dataRow, setDataRow] = useState<IHopDong | null>(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openImport, setOpenImport] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (listHopDongHienHuu?.metadata) {
      setTabs((prevTabs) => {
        const updatedTabs = [...prevTabs];
        updatedTabs[0].count = listHopDongHienHuu.metadata.total;
        updatedTabs[0].isLoading = false;
        return updatedTabs;
      });
    }
  }, [listHopDongHienHuu?.metadata]);

  useEffect(() => {
    if (listHopDongNhap?.metadata) {
      setTabs((prevTabs) => {
        const updatedTabs = [...prevTabs];
        updatedTabs[1].count = listHopDongNhap.metadata.total;
        updatedTabs[1].isLoading = false;
        return updatedTabs;
      });
    }
  }, [listHopDongNhap?.metadata]);

  useEffect(() => {
    if (listHopDongDaGuiPheDuyet?.metadata) {
      setTabs((prevTabs) => {
        const updatedTabs = [...prevTabs];
        updatedTabs[2].count = listHopDongDaGuiPheDuyet.metadata.total;
        updatedTabs[2].isLoading = false;
        return updatedTabs;
      });
    }
  }, [listHopDongDaGuiPheDuyet]);

  useEffect(() => {
    if (listHopDongCanPheDuyet?.metadata) {
      setTabs((prevTabs) => {
        const updatedTabs = [...prevTabs];
        updatedTabs[3].count = listHopDongCanPheDuyet.metadata.total;
        updatedTabs[3].isLoading = false;
        return updatedTabs;
      });
    }
  }, [listHopDongCanPheDuyet?.metadata]);

  useEffect(() => {
    const { query } = router;
    if (query && query.tab) {
      dispatch({ type: 'set-active-tab', payload: query.tab as ITabValue });
    }
  }, [dispatch, router]);

  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleOpenSidebar = () => {
    setOpenSidebar(true);
  };
  const handleCloseSideBar = () => {
    setDataRow(null);
    setOpenSidebar(false);

    handleCloseConfirm();
  };

  // Import
  const handleClickOpenImport = () => {
    setOpenImport(true);
  };

  const handleCloseImport = () => {
    setOpenImport(false);
  };

  const handleChangeTab = (val: ITabValue) => {
    if (activeTab !== val) {
      dispatch({ type: 'set-active-tab', payload: val });
      dispatchFilter({ type: 'reset-form-filter' });
      router.push(`/hop-dong-mat-bang/danh-sach/?tab=${val}`);
    }
  };

  return (
    <>
      <Head>
        <title>Hợp đồng mặt bằng | Danh sách</title>
      </Head>
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Danh sách hợp đồng mặt bằng"
          links={[
            { name: 'Quản lý hợp đồng nhà trạm', href: PATH_DASHBOARD.root },
            { name: 'Hợp đồng mặt bằng', href: PATH_HOP_DONG_MAT_BANG.root },
            { name: 'Danh sách' },
          ]}
          action={
            <Fab sx={{ width: '40px', height: '40px' }} onClick={handleOpenPopover}>
              <Iconify icon="eva:plus-fill" />
            </Fab>
          }
        />
        <Card sx={{ mb: 5 }}>
          <Scrollbar>
            <Stack
              direction="row"
              divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
              sx={{ py: 2 }}
            >
              <ThanhToanAnalytic
                title="Cần thanh toán"
                subTitle="Trước 15 ngày so với kỳ thanh toán tiếp theo"
                total={hdCanThanhToan?.metadata?.total || 0}
                icon="eva:clock-fill"
                color={theme.palette.warning.main}
              />
              <ThanhToanAnalytic
                title="Quá hạn thanh toán"
                subTitle="Vượt quá thời gian Đến ngày của kỳ thanh toán hiện tại"
                total={hdQuaHan?.metadata?.total || 0}
                icon="eva:close-circle-fill"
                color={theme.palette.error.main}
              />
            </Stack>
          </Scrollbar>
        </Card>
        <Card>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => handleChangeTab(newValue)}
            sx={{
              px: 2,
              bgcolor: 'background.neutral',
            }}
          >
            {tabs.map((tab) => {
              const coQuyenXetDuyet = allQuyen.some((kv) =>
                kv.listQuyen.some((q) => q.module === 'HOP_DONG' && q.action === 'XET_DUYET')
              );
              if (!coQuyenXetDuyet && tab.value === 'can_phe_duyet') {
                return null;
              }
              return (
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
              );
            })}
          </Tabs>
          <Divider />
          {tabs.map(
            (tab) =>
              tab.value === activeTab && (
                <Box key={tab.value} sx={{ mt: 1 }}>
                  {tab.component}
                </Box>
              )
          )}
        </Card>
      </Container>

      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="top-right"
        sx={{ width: WIDTH_MENU_POPOVER, marginTop: '10px' }}
      >
        <PermissionBgProcessWrapper
          module="HOP_DONG"
          action="IMPORT"
          hideWhenBlocked={false}
          blockedComponentPropsOverride={{ disabled: true, onClick: () => {} }}
        >
          <MenuItem
            onClick={() => {
              handleOpenSidebar();
              handleClosePopover();
            }}
          >
            <Iconify icon="eva:plus-fill" />
            Thêm mới
          </MenuItem>
        </PermissionBgProcessWrapper>

        <MenuItem
          disabled={false}
          onClick={() => {
            handleClickOpenImport();
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:cloud-upload-fill" />
          Import
        </MenuItem>
      </MenuPopover>

      {openSidebar && (
        <CreateHopDongProvider>
          <HopDongSidebar
            open={openSidebar}
            onClose={handleOpenConfirm}
            onSaveSuccess={() => handleCloseSideBar()}
            hopDongId={null}
          />
        </CreateHopDongProvider>
      )}

      {openImport && (
        <HopDongImport
          title="Import hợp đồng mặt bằng từ file Excel"
          open={openImport}
          onClose={() => handleCloseImport()}
        />
      )}
      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Cảnh báo"
        content="Bạn có chắc chắn muốn thoát quá trình tạo mới?"
        action={
          <LoadingButton
            variant="contained"
            type="button"
            color="error"
            loading={false}
            onClick={handleCloseSideBar}
          >
            Thoát
          </LoadingButton>
        }
      />
    </>
  );
}
