import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  CircularProgress,
  Container,
  Divider,
  Fab,
  MenuItem,
  Tab,
  Tabs,
} from '@mui/material';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ReactNode, useEffect, useState } from 'react';
import { IHopDongXaHoiHoa, IHopDongXaHoiHoaForm } from 'src/@types/hopdongxahoihoa';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/CustomBreadcrumbs';
import Iconify from 'src/components/iconify/Iconify';
import { LabelColor } from 'src/components/label';
import Label from 'src/components/label/Label';
import MenuPopover from 'src/components/menu-popover';
import PermissionBgProcessWrapper from 'src/components/permission-bg-process-wrapper';
import { useSettingsContext } from 'src/components/settings';
import { ITabValue } from 'src/context/hop-dong-mat-bang/listHopDongContext';
import { useListHopDongXaHoiHoaContext } from 'src/context/hop-dong-xa-hoi-hoa/listHopDongXaHoiHoaContext';
import { useHopDongXaHoiHoaQuery } from 'src/data/hopDongXaHoiHoa';
import useAuthCredentials from 'src/hooks/useAuthCredentials';
import { PATH_DASHBOARD, PATH_HOP_DONG_XA_HOI_HOA } from 'src/routes/paths';
import TabActiveDraft from './tabs-hop-dong/tab-active-draft';
import TabCanPheDuyet from './tabs-hop-dong/tab-can-phe-duyet/TabCanPheDuyet';
import TabDaGuiPheDuyet from './tabs-hop-dong/tab-da-gui-phe-duyet/TabDaGuiPheDuyet';

const HopDongXaHoiHoaImport = dynamic(() => import('./HopDongXaHoiHoaImport'), { ssr: false });
const ConfirmDialog = dynamic(() => import('src/components/confirm-dialog/ConfirmDialog'));
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
    component: <TabActiveDraft type="active" />,
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

export default function HopDongXaHoiHoaContainer() {
  const { allQuyen } = useAuthCredentials();

  const {
    dispatch,
    state: { activeTab },
  } = useListHopDongXaHoiHoaContext();

  const { data: listHopDongHienHuu } = useHopDongXaHoiHoaQuery(
    {
      page: 0,
      size: 1,
      trangThaiHopDong: 'HOAT_DONG',
      loaiHopDong: 'XA_HOI_HOA',
      countOnly: 1,
    },
    { refetchOnWindowFocus: false }
  );
  const { data: listHopDongNhap } = useHopDongXaHoiHoaQuery(
    {
      page: 0,
      size: 1,
      trangThaiHopDong: 'NHAP',
      loaiHopDong: 'XA_HOI_HOA',
      countOnly: 1,
    },
    { refetchOnWindowFocus: false }
  );
  const { data: listHopDongDaGuiPheDuyet } = useHopDongXaHoiHoaQuery(
    {
      page: 0,
      size: 1,
      trangThaiHopDong: 'CHO_PHE_DUYET',
      loaiHopDong: 'XA_HOI_HOA',
      countOnly: 1,
    },
    { refetchOnWindowFocus: false }
  );

  const { themeStretch } = useSettingsContext();

  const [tabs, setTabs] = useState<ITab[]>(TABS);
  const [openSidebar, setOpenSidebar] = useState(false);
  const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);
  const [dataRow, setDataRow] = useState<IHopDongXaHoiHoa | null>(null);
  const [updateData, setUpdateData] = useState<IHopDongXaHoiHoaForm | null>(null);
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
  }, [listHopDongHienHuu]);

  useEffect(() => {
    if (listHopDongNhap?.metadata) {
      setTabs((prevTabs) => {
        const updatedTabs = [...prevTabs];
        updatedTabs[1].count = listHopDongNhap.metadata.total;
        updatedTabs[1].isLoading = false;
        return updatedTabs;
      });
    }
  }, [listHopDongNhap]);

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
    setUpdateData(null);

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
      router.push(`/hop-dong-xa-hoi-hoa/danh-sach/?tab=${val}`);
    }
  };

  return (
    <>
      <Head>
        <title>Hợp đồng xã hội hóa | Danh sách</title>
      </Head>
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Danh sách hợp đồng xã hội hoá"
          links={[
            { name: 'Quản lý hợp đồng nhà trạm', href: PATH_DASHBOARD.root },
            { name: 'Hợp đồng xã hội hóa', href: PATH_HOP_DONG_XA_HOI_HOA.root },
            { name: 'Danh sách' },
          ]}
          action={
            <Fab sx={{ width: '40px', height: '40px' }} onClick={handleOpenPopover}>
              <Iconify icon="eva:plus-fill" />
            </Fab>
          }
        />

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

      {/* {openSidebar && (
        <CreateHopDongProvider>
          <HopDongSidebar
            open={openSidebar}
            onClose={handleOpenConfirm}
            onSaveSuccess={() => handleCloseSideBar()}
            initData={updateData}
          />
        </CreateHopDongProvider>
      )} */}

      {openImport && (
        <HopDongXaHoiHoaImport
          title="Import hợp đồng xã hội hóa từ file Excel"
          open={openImport}
          onClose={() => handleCloseImport()}
        />
      )}
      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Cảnh báo"
        content={`Bạn có chắc chắn muốn thoát quá trình ${updateData ? 'cập nhật' : 'tạo mới'}?`}
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
