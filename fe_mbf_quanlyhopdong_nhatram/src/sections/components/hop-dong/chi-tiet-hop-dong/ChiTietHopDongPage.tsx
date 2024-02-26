import { Box, Card, Stack, Tab, Tabs } from '@mui/material';
import equal from 'fast-deep-equal';
import isNil from 'lodash/isNil';
import isUndefined from 'lodash/isUndefined';
import { Difference } from 'microdiff';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { ILoaiHopDong } from 'src/@types/hopdong';
import { IHopDong, IPheDuyetHopDongInput } from 'src/@types/hopdongmatbang';
import Label from 'src/components/label/Label';
import { CreateHopDongProvider } from 'src/context/hop-dong-mat-bang/createHopDongContext';
import { useChiTietHopDongContext } from 'src/context/hop-dong/chitietHopDongContext';
import { useHopDongDetailQuery } from 'src/data/hopDongMatBang';
import { useOldFilesHopDong } from 'src/data/hopdong';
import { useXetDuyetHopDongMutation } from 'src/data/pheduyetHopDong';
import DanhSachPhuLuc from './DanhSachPhuLuc';
import FileDinhKem from './FileDinhKem';
import TabLichSuHopDong from './lich-su-hop-dong/TabLichSuHopDong';
import LichSuPheDuyet from './lich-su-phe-duyet/LichSuPheDuyet';
import RightBar from './right-bar/RightBar';
import TabDamPhan from './tab-dam-phan/TabDamPhan';
import TabTraCuu from './tab-tra-cuu/TabTraCuu';
import ThongTinChiTiet from './thong-tin-chi-tiet/ThongTinChiTiet';

const HopDongSidebar = dynamic(() => import('../../../hopdongmatbang/HopDongSidebar'), {
  ssr: false,
});

type IProps = {
  type?: ILoaiHopDong;
};

const ChiTietHopDongPage = ({ type }: IProps) => {
  const {
    state: { openEditHopDong, hopDongForm, hopDong, rightBar },
    dispatch,
  } = useChiTietHopDongContext();

  const [valueTabs, setValuesTab] = useState<string>('thong_tin_chi_tiet');
  const [newData, setNewData] = useState<IHopDong | null>(null);
  const [openSendChinhSuaDialog, setOpenSendChinhSuaDialog] = useState<boolean>(false);
  const [isTabChange, setIsTabChange] = useState(false);

  const { data: oldFilesData } = useOldFilesHopDong(
    { soHopDong: newData?.soHopDong || '' },
    { enabled: !!newData?.soHopDong }
  );

  const TABS = [
    { value: 'thong_tin_chi_tiet', label: 'Thông tin chi tiết', color: 'info', count: 0 },
    {
      value: 'file_dinh_kem',
      label: 'Danh sách files',
      color: 'success',
      count: newData?.hopDongFileModels.length ?? 0,
    },
    {
      value: 'lich_su_phe_duyet',
      label: 'Phê duyệt',
      color: 'primary',
      count: 0,
    },
    {
      value: 'dam_phan',
      label: 'Đàm phán',
      color: 'primary',
      count: 0,
    },
    {
      value: 'danh_sach_phu_luc_hop_dong',
      label: 'Danh sách phụ lục hợp đồng',
      color: 'warning',
      count: 0,
    },
    {
      value: 'tra_cuu',
      label: 'Tra cứu',
      color: 'success',
      count: oldFilesData?.elements?.length || 0,
    },
    {
      value: 'lich_su',
      label: 'Lịch sử',
      color: 'success',
      count: 0,
    },
  ] as const;
  const router = useRouter();
  const {
    query: { id, tab: tabChange },
    isReady,
  } = router;
  const { data, isLoading, isError } = useHopDongDetailQuery(id ? Number(id) : 0, {
    refetchOnWindowFocus: false,
    enabled: !!(isReady && id),
  });

  const { mutate: xetDuyet, isLoading: sendingXetDuyet } = useXetDuyetHopDongMutation();

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (!isLoading && !isError && !isNil(data) && !equal(data, newData)) {
      setNewData(data?.elements[0]);
      dispatch({ type: 'set-data-hop-dong', payload: data.elements[0] });
    }
  }, [isLoading, isError, data, newData, dispatch]);
  const handleChangeTabs = (event: React.SyntheticEvent<Element, Event>, newValue: string) => {
    setValuesTab(newValue);
  };
  const componentMap: {
    [key in typeof TABS[number]['value']]: React.ReactNode;
  } = {
    thong_tin_chi_tiet: <ThongTinChiTiet data={newData} />,
    file_dinh_kem: (
      <FileDinhKem data={newData?.hopDongFileModels ?? []} soHopDong={newData?.soHopDong ?? ''} />
    ),
    danh_sach_phu_luc_hop_dong: (
      <DanhSachPhuLuc
        dataFile={newData?.hopDongFileModels.filter((item) => item.loai === 'FILE_PHU_LUC') ?? []}
        dataPhuLuc={newData?.hopDongPhuLucModels ?? []}
        soHopDong={newData?.soHopDong ?? ''}
      />
    ),
    lich_su_phe_duyet: <LichSuPheDuyet hopDongId={Number(id)} isTabChange={isTabChange} />,
    dam_phan: <TabDamPhan hopDongId={Number(id)} />,
    tra_cuu: <TabTraCuu oldFiles={oldFilesData?.elements || []} />,
    lich_su: <TabLichSuHopDong hopDongId={Number(id)} />,
  };
  const renderComponent = () =>
    componentMap[
      valueTabs as keyof {
        [key in typeof TABS[number]['value']]: React.ReactNode;
      }
    ] || null;
  useEffect(() => {
    if (!isUndefined(tabChange)) {
      setValuesTab(tabChange as string);
      setIsTabChange(true);
    }
  }, [tabChange]);

  // const handlePheDuyetKhiChinhSua = ({ comment }: { comment: string }) => {
  //   if (!hopDong || !rightBar || isNil(rightBar?.data?.id)) return;

  //   if (rightBar.data?.id) {
  //     const input: IPheDuyetHopDongInput = {
  //       hopDongId: hopDong.id,
  //       hopDongPheDuyetId: rightBar.data.id,
  //       ghiChu: comment || '',
  //       trangThaiPheDuyet: 'UPDATE_HOP_DONG',
  //       changeLog: diffChinhSua ? JSON.stringify(diffChinhSua) : '',
  //     };
  //     xetDuyet(input, {
  //       onSuccess() {
  //         dispatch({ type: 'toggle-refresh-phe-duyet' });
  //         dispatch({ type: 'close-edit-hop-dong' });
  //         // enqueueSnackbar(`Gửi lại xét duyệt với nội dung được chỉnh sửa thành công`, {
  //         //   variant: 'success',
  //         // });
  //         setOpenSendChinhSuaDialog(false);

  //         // dispatch({ type: 'toggle-refresh-phe-duyet' });
  //         // dispatch({ type: 'close-edit-hop-dong' });
  //         // enqueueSnackbar(`Gửi lại xét duyệt với nội dung được chỉnh sửa thành công`, {
  //         //   variant: 'success',
  //         // });
  //         // setOpenSendChinhSuaDialog(false);
  //       },
  //       onError() {
  //         const msg = 'Có lỗi trong quá trình gửi xét duyệt hợp đồng';
  //         enqueueSnackbar(msg, {
  //           variant: 'error',
  //         });
  //       },
  //     });
  //   }
  // };

  const handleCreateXetDuyetLogWhenUpdateHopDong = (diff: Difference[]) => {
    if (!hopDong || !rightBar || isNil(rightBar?.data?.id)) return;

    const input: IPheDuyetHopDongInput = {
      hopDongId: hopDong.id,
      hopDongPheDuyetId: rightBar?.data?.id || 0,
      ghiChu: '',
      trangThaiPheDuyet: 'UPDATE_HOP_DONG',
      changeLog: diff ? JSON.stringify({ data: diff, version: '0.0.0' }) : '',
    };
    xetDuyet(input, {
      onSuccess() {
        dispatch({ type: 'toggle-refresh-phe-duyet' });
        dispatch({ type: 'close-edit-hop-dong' });
        // enqueueSnackbar(`Gửi lại xét duyệt với nội dung được chỉnh sửa thành công`, {
        //   variant: 'success',
        // });
        // setOpenSendChinhSuaDialog(false);

        // dispatch({ type: 'toggle-refresh-phe-duyet' });
        // dispatch({ type: 'close-edit-hop-dong' });
        // enqueueSnackbar(`Gửi lại xét duyệt với nội dung được chỉnh sửa thành công`, {
        //   variant: 'success',
        // });
        // setOpenSendChinhSuaDialog(false);
      },
      onError() {
        const msg = 'Có lỗi trong quá trình gửi xét duyệt hợp đồng';
        enqueueSnackbar(msg, {
          variant: 'error',
        });
      },
    });
  };

  return (
    <>
      <Card sx={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
        <Stack direction="row" flexGrow={1}>
          <Stack flexGrow={1}>
            <Tabs
              value={valueTabs}
              onChange={handleChangeTabs}
              sx={{
                px: 2,
                bgcolor: 'background.neutral',
              }}
            >
              {TABS.map((tab) => (
                <Tab
                  key={tab.value}
                  value={tab.value}
                  label={tab.label}
                  icon={
                    tab.count > 0 ? (
                      <Label color={tab.color} sx={{ mr: 1 }}>
                        {tab.count > 0 ? tab.count : ''}
                      </Label>
                    ) : (
                      ''
                    )
                  }
                />
              ))}
            </Tabs>
            <Box sx={{ p: 3 }}>{renderComponent()}</Box>
          </Stack>

          <RightBar />
        </Stack>
      </Card>

      {/*
       * Check loại hợp đồng để mở create loại hợp đồng đó
       */}
      {openEditHopDong && (
        <CreateHopDongProvider>
          <HopDongSidebar
            open={openEditHopDong}
            onClose={() => {
              dispatch({ type: 'close-edit-hop-dong' });
            }}
            onSaveSuccess={() => dispatch({ type: 'close-edit-hop-dong' })}
            hopDongId={Number(id)}
            type="update-at-flow-phe-duyet"
            onSaveAndResendPheDuyet={(diff) => {
              handleCreateXetDuyetLogWhenUpdateHopDong(diff);
            }}
          />
        </CreateHopDongProvider>
      )}
      {/* <HopDongSendDiffDialog
        open={openSendChinhSuaDialog}
        onClose={() => setOpenSendChinhSuaDialog(false)}
        onSave={handlePheDuyetKhiChinhSua}
        type="gui-lai-phe-duyet"
      /> */}
    </>
  );
};

export default ChiTietHopDongPage;
