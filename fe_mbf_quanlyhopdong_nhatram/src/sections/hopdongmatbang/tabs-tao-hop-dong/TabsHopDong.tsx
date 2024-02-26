import { LoadingButton } from '@mui/lab';
import { Box, Button, Divider, Stack, Tab, Tabs } from '@mui/material';
import equal from 'fast-deep-equal';
import { ReactNode, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { IHopDongForm } from 'src/@types/hopdongmatbang';
import Label from 'src/components/label/Label';
import {
  ITabValue,
  useCreateHopDongContext,
} from 'src/context/hop-dong-mat-bang/createHopDongContext';
import { useOldFilesHopDong } from 'src/data/hopdong';
import TabDoiTac from './TabDoiTac';
import TabFilesGiayToSoHuu from './TabFilesGiayToSoHuu';
import TabFilesHopDong from './TabFilesHopDong';
import TabFilesPhuLuc from './TabFilesPhuLuc';
import TabHangMuc from './TabHangMuc';
import TabTraCuu from './TabTraCuu';

type ITab = { value: ITabValue; label: string; component: ReactNode; count: number };

const TABS: ITab[] = [
  {
    value: 'doi_tac',
    label: 'Thông tin đối tác',
    component: <TabDoiTac />,
    count: 0,
  },
  {
    value: 'hang_muc',
    label: 'Trạm',
    component: <TabHangMuc />,
    count: 0,
  },
  {
    value: 'files_hop_dong',
    label: 'Files hợp đồng',
    component: <TabFilesHopDong />,
    count: 0,
  },
  {
    value: 'files_giay_to_so_huu',
    label: 'Files giấy tờ sử hữu',
    component: <TabFilesGiayToSoHuu />,
    count: 0,
  },
];

type Props = {
  onClose: VoidFunction;
  isSubmitting: boolean;
};
const TabsHopDong = ({ onClose, isSubmitting = false }: Props) => {
  const {
    state: { formType, activeTab },
    dispatch,
  } = useCreateHopDongContext();
  const { watch, getValues } = useFormContext<IHopDongForm>();
  const wFilesHD = watch('filesDinhKem');
  const wFilesGiayToSoHuu = watch('filesGiayToSuHuu');

  const { data: oldFiles } = useOldFilesHopDong(
    { soHopDong: getValues('soHopDong') },
    { enabled: formType === 'update' }
  );

  const [tabs, setTabs] = useState<ITab[]>([]);
  useEffect(() => {
    let _tabs: ITab[] = [];
    if (formType === 'create') {
      _tabs = TABS;
    } else if (formType === 'update') {
      _tabs = TABS.concat([
        { value: 'phu_luc', label: 'Phụ lục', component: <TabFilesPhuLuc />, count: 0 },
        {
          value: 'tra_cuu',
          label: 'Tra cứu',
          component: <TabTraCuu oldFiles={oldFiles?.elements || []} />,
          count: oldFiles?.elements?.length || 0,
        },
      ]);
    }
    if (_tabs?.[2]) {
      _tabs[2] = Object.assign(_tabs[2], { count: wFilesHD.length });
    }
    if (_tabs?.[3]) {
      _tabs[3] = Object.assign(_tabs[3], { count: wFilesGiayToSoHuu.length });
    }

    if (!equal(tabs, _tabs)) {
      setTabs(_tabs);
    }
  }, [tabs, formType, wFilesHD, wFilesGiayToSoHuu, oldFiles]);

  const handleChangeTab = (val: ITabValue) => {
    dispatch({ type: 'set-active-tab', payload: val });
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box
        display="flex"
        width="100%"
        justifyContent="center"
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'background.neutral',
        }}
      >
        <Tabs
          sx={{ bgcolor: 'background.neutral', px: 2.5 }}
          variant="scrollable"
          scrollButtons="auto"
          value={activeTab}
          onChange={(event, newValue) => handleChangeTab(newValue)}
        >
          {tabs.map((tab) => (
            <Tab
              key={tab.value}
              value={tab.value}
              label={tab.label}
              icon={
                tab.count > 0 ? (
                  <Label color="success" sx={{ mr: 1 }}>
                    {tab.count}
                  </Label>
                ) : (
                  ''
                )
              }
            />
          ))}
        </Tabs>
      </Box>

      {tabs.map((tab) => {
        const visible = tab.value === activeTab;
        return (
          <Box
            key={tab.value}
            sx={{
              mt: visible ? 2 : 0,
              p: visible ? 2.5 : 0,
              visibility: visible ? 'visible' : 'hidden',
              height: visible ? 'inherit' : 0,
            }}
          >
            {tab.component}

            <Divider sx={{ borderStyle: 'dashed', mb: 4 }} />
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button variant="outlined" color="inherit" onClick={onClose}>
                Đóng
              </Button>
              <LoadingButton
                variant="contained"
                type="submit"
                color="primary"
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                {formType === 'update' ? 'Lưu thay đổi' : 'Tạo mới'}
              </LoadingButton>
            </Stack>
          </Box>
        );
      })}
    </Box>
  );
};

export default TabsHopDong;
