import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Box,
  CircularProgress,
  Divider,
  Drawer,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import equal from 'fast-deep-equal';
import { isNull } from 'lodash';
import concat from 'lodash/concat';
import isNil from 'lodash/isNil';
import diff, { Difference } from 'microdiff';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { FieldErrors, useForm } from 'react-hook-form';
import { ILoaiFileHopDong } from 'src/@types/hopdong';
import { IHopDongCreateInput, IHopDongForm, IHopDongUpdateInput } from 'src/@types/hopdongmatbang';
import ConfirmDialog from 'src/components/confirm-dialog/ConfirmDialog';
import FormProvider from 'src/components/hook-form/FormProvider';
import Iconify from 'src/components/iconify/Iconify';
import Scrollbar from 'src/components/scrollbar/Scrollbar';
import {
  ITramOpt,
  useCreateHopDongContext,
} from 'src/context/hop-dong-mat-bang/createHopDongContext';
import {
  useCreateHopDongMutation,
  useHopDongDetailQuery,
  useUpdateHopDongMutation,
} from 'src/data/hopDongMatBang';
import { useTramsQuery } from 'src/data/tram';
import { fCurrencyVND } from 'src/utils/formatNumber';
import { transformRowToForm } from 'src/utils/hopDongUtils';
import ChuKyField from './fields/ChuKyField';
import DoiTuongKyHopDongField from './fields/DoiTuongKyHopDongField';
import GhiChuField from './fields/GhiChuField';
import HinhThucDauTuField from './fields/HinhThucDauTuField';
import HinhThucKyHopDongField from './fields/HinhThucKyHopDongField';
import KhoanMucField from './fields/KhoanMucField';
import KyQuyField from './fields/KyQuyField';
import NgayKetThucHopDongField from './fields/NgayKetThucHopDongField';
import NgayKyHopDongField from './fields/NgayKyHopDongField';
import SoHopDongErpField from './fields/SoHopDongErpField';
import SoHopDongField from './fields/SoHopDongField';
import ThueVATField from './fields/ThueVATField';
import { HopDongSchema } from './schema/hopDongSchema';
import TabsHopDong from './tabs-tao-hop-dong/TabsHopDong';

const SPACING = 2.5;
const WIDTH_DRAWER = 920;

const defaultValues: IHopDongForm = {
  id: null,
  soHopDong: '',
  soHopDongERP: '',
  hinhThucKy: null,
  hinhThucDauTu: null,
  doiTuongKy: null,
  ngayKy: new Date(),
  ngayKetThuc: new Date(),
  coKyQuy: false,
  giaKyQuy: 0,
  ghiChu: '',

  tenDoiTac: '',
  sdt: '',
  soCMND: '',
  maSoThue: '',
  diaChiLienHe: '',

  chuTaiKhoan: '',
  soTaiKhoan: '',
  nganHangChiNhanh: '',

  thueVAT: 0,
  hinhThucThanhToan: null,
  khoanMuc: null,
  chuKyNam: 0,
  chuKyThang: 0,
  chuKyNgay: 0,

  remoteFiles: [],
  filesDinhKem: [],
  filesGiayToSuHuu: [],
  filesPhuLuc: [],
  hopDongPhuLucModels: [],
  ghiChuPhuLuc: '',

  hangMucs: [
    {
      status: 'new',
      tram: {
        id: '',
        ma: '',
        maErp: '',
        maDTXD: '',
      },
      giaThueTram: 0,
      dienKhoan: {
        added: false,
        gia: 0,
      },
      phuTroList: [],
      hopDongKyThanhToanList: [],
      ngayBatDauTT: new Date(),
      isDungChung: false,
      loaiHangMucCsht: null,
      maDonViDungChung: '',
      donViDungChung: null,
      thoiDiemPhatSinh: null,
      ngayLapDatThietBi: null,
      filesDungChung: [],
      ngayBatDauDungChung: null,
      ngayKetThucDungChung: null,
    },
  ],
};

export interface HopDongProps {
  open: boolean;
  onClose: (value: boolean) => void;
  onSaveSuccess: VoidFunction;
  type?: 'update-at-flow-phe-duyet';
  onSaveAndResendPheDuyet?: (diff: Difference[]) => void;
  hopDongId: number | null;
}

export default function HopDongSidebar(props: HopDongProps) {
  const { onClose, open, onSaveSuccess, type, onSaveAndResendPheDuyet, hopDongId } = props;

  const [openConfirm, setOpenConfirm] = useState(false);
  const [preparing, setPreparing] = useState(false);

  const { data: tramData } = useTramsQuery(
    { size: undefined, page: undefined, responseType: 0 },
    { refetchOnWindowFocus: false }
  );
  const { data: hopDongData, isFetching } = useHopDongDetailQuery(hopDongId || 0, {
    refetchOnWindowFocus: false,
    enabled: !!hopDongId,
  });
  const {
    state: { formType, agreeLastConfirm, activeTab, tramOptions },
    dispatch,
  } = useCreateHopDongContext();

  const methods = useForm<IHopDongForm>({
    resolver: yupResolver(HopDongSchema),
    defaultValues,
    mode: 'all',
  });
  const { handleSubmit, reset, watch, formState } = methods;
  const { defaultValues: _initData } = formState;
  const wHangMucs = watch('hangMucs');
  const wCoKyQuy = watch('coKyQuy');

  useEffect(() => {
    if (hopDongId) {
      dispatch({ type: 'set-form-type', payload: 'update' });
    } else {
      dispatch({ type: 'set-form-type', payload: 'create' });
    }
  }, [hopDongId, reset, dispatch]);

  useEffect(() => {
    const transform = async () => {
      if (hopDongId && hopDongData && hopDongData?.elements?.length > 0) {
        setPreparing(true);
        dispatch({ type: 'set-data-hop-dong', payload: hopDongData.elements[0] });
        const _values = await transformRowToForm(hopDongData.elements[0]);
        reset(_values);
        setPreparing(false);
      }
    };

    transform();
  }, [hopDongId, hopDongData, reset, dispatch]);

  // dispatch trams
  useEffect(() => {
    if (tramData && tramData.elements) {
      const _tramOpts: ITramOpt[] = tramData.elements.map((dt) => ({
        id: dt.id,
        ma: dt.maTram || '',
        maDTXD: dt.maDauTuXayDung || '',
        maErp: isNil(dt.maTramErp) ? '' : dt.maTramErp,
      }));
      if (!equal(_tramOpts, tramOptions)) {
        dispatch({ type: 'set-tram-opts', payload: _tramOpts });
      }
    }
  }, [tramData, tramOptions, dispatch]);

  const { mutate: createHD, isLoading: creating } = useCreateHopDongMutation();
  const { mutate: updateHD, isLoading: updating } = useUpdateHopDongMutation();
  const { enqueueSnackbar } = useSnackbar();

  const onError = (e: FieldErrors<IHopDongForm>) => {
    const errorDoiTac = !!(
      e?.tenDoiTac ||
      e?.sdt ||
      e?.soCMND ||
      e?.maSoThue ||
      e?.diaChiLienHe ||
      e?.maSoThue
    );
    const errorThuHuong = !!(e?.chuTaiKhoan || e?.soTaiKhoan || e?.nganHangChiNhanh);
    if ((errorDoiTac || errorThuHuong) && activeTab !== 'doi_tac') {
      dispatch({ type: 'set-active-tab', payload: 'doi_tac' });
      return;
    }

    const errorTrams = !!e?.hangMucs;
    if (errorTrams && activeTab !== 'hang_muc') {
      dispatch({ type: 'set-active-tab', payload: 'hang_muc' });
      return;
    }

    const errorFilesDinhKem = !!e?.filesDinhKem;
    if (errorFilesDinhKem && activeTab !== 'files_hop_dong') {
      dispatch({ type: 'set-active-tab', payload: 'files_hop_dong' });
      return;
    }

    const errorFilesGiayToSoHuu = !!e?.filesGiayToSuHuu;
    if (errorFilesGiayToSoHuu && activeTab !== 'files_giay_to_so_huu') {
      dispatch({ type: 'set-active-tab', payload: 'files_giay_to_so_huu' });
      return;
    }

    const errorPhuLuc = !!(e?.filesPhuLuc || e?.ghiChuPhuLuc);
    if (errorPhuLuc && activeTab !== 'phu_luc') {
      dispatch({ type: 'set-active-tab', payload: 'phu_luc' });
    }
  };

  const handleOpenConfirm = () => {
    dispatch({ type: 'set-agree-last-confirm', payload: true });
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    dispatch({ type: 'set-agree-last-confirm', payload: false });
    setOpenConfirm(false);
  };

  const handleCreating = (input: IHopDongCreateInput, data: IHopDongForm) => {
    createHD(input, {
      onSuccess: () => {
        enqueueSnackbar(`Tạo mới hợp đồng ${data.soHopDong} thành công`, {
          variant: 'success',
        });
        handleCloseConfirm();
        onSaveSuccess();
      },
      onError: (error: any) => {
        handleCloseConfirm();
        let msg = 'Có lỗi trong quá trình thêm mới hợp đồng';
        if (error?.response?.status === 409) {
          msg = `Số hợp đồng hoặc số hợp đồng erp đã tồn tại.\nVui lòng kiểm tra lại.`;
        }
        enqueueSnackbar(msg, {
          variant: 'error',
        });
      },
    });
  };

  const handleUpdating = (input: IHopDongUpdateInput, data: IHopDongForm) => {
    if (!data || !data.id || !_initData) return;
    const diffData = diff(_initData, data).map((_diff) => {
      let newPath = _diff.path;
      if (_diff.path.includes('hangMucs') && _diff.path.length > 2) {
        newPath = _diff.path.map((p, i) => {
          if (i === 1 && typeof p === 'number') {
            return data.hangMucs?.[p]?.tram?.ma || data.hangMucs?.[p]?.tram?.maDTXD;
          }
          return p;
        });
      }
      return {
        ..._diff,
        path: newPath,
      };
    });
    console.log('diffData: ', diffData);
    if (hopDongData && hopDongData?.elements?.[0]?.trangThaiHopDong === 'HOAT_DONG') {
      input.changeLog = JSON.stringify({ data: diffData });
    }
    updateHD(
      { id: data.id, input },
      {
        onSuccess: () => {
          enqueueSnackbar(`Cập nhật hợp đồng ${data.soHopDong} thành công`, {
            variant: 'success',
          });
          if (type === 'update-at-flow-phe-duyet' && hopDongId && _initData) {
            onSaveAndResendPheDuyet?.(diffData);
          }
          handleCloseConfirm();
          onSaveSuccess();
        },
        onError: (error: any) => {
          handleCloseConfirm();
          let msg = 'Có lỗi trong quá trình cập nhật hợp đồng';
          if (error?.response?.status === 409) {
            msg = `Số hợp đồng hoặc số hợp đồng erp đã tồn tại.\nVui lòng kiểm tra lại.`;
          }
          enqueueSnackbar(msg, {
            variant: 'error',
          });
        },
      }
    );
  };

  const onSubmit = async (data: IHopDongForm) => {
    if (!agreeLastConfirm) {
      handleOpenConfirm();
      return;
    }

    if (
      data.hangMucs.length === 0 ||
      !data.hangMucs[0].tram.id ||
      !data.hinhThucDauTu ||
      !data.hinhThucKy ||
      !data.doiTuongKy ||
      !data.hinhThucThanhToan
    )
      return;

    const oldFilesDinhKem = data.filesDinhKem
      .filter((f) => f.status === 'old')
      .map((f) => ({ id: f.id as number, loai: 'FILE_HOP_DONG' }));
    const newFilesDinhKem = data.filesDinhKem.filter((f) => f.status === 'new').map((f) => f.file);
    const infoFilesDinhKem: { loaiFile: ILoaiFileHopDong }[] = newFilesDinhKem.map(() => ({
      loaiFile: 'FILE_HOP_DONG',
    }));
    //--
    const oldFilesGiayToSoHuu = data.filesGiayToSuHuu
      .filter((f) => f.status === 'old')
      .map((f) => ({ id: f.id as number, loai: 'FILE_GIAY_TO_SO_HUU' }));
    const newFilesGiayToSuHuu = data.filesGiayToSuHuu
      .filter((f) => f.status === 'new')
      .map((f) => f.file);
    const infoFilesGiayToSoHuu: { loaiFile: ILoaiFileHopDong }[] = newFilesGiayToSuHuu.map(() => ({
      loaiFile: 'FILE_GIAY_TO_SO_HUU',
    }));
    //--
    const oldFilesDungChung = [];
    const newFilesDungChung: File[] = [];
    const infoFilesDungChung: { loaiFile: ILoaiFileHopDong; tramId?: number }[] = [];
    data.hangMucs.forEach((hm) => {
      hm.filesDungChung.forEach((f) => {
        if (f.status === 'old') {
          oldFilesDungChung.push({ id: f.id as number, loai: 'FILE_DUNG_CHUNG' });
        } else {
          newFilesDungChung.push(f.file);
          infoFilesDungChung.push({ loaiFile: 'FILE_DUNG_CHUNG', tramId: hm.tram.id as number });
        }
      });
    });
    //--
    const oldFilesPhuLuc = data.filesPhuLuc
      .filter((f) => f.status === 'old')
      .map((f) => ({ id: f.id as number, loai: 'FILE_PHU_LUC' }));
    const newFilesPhuLuc = data.filesPhuLuc.filter((f) => f.status === 'new').map((f) => f.file);
    const infoFilesPhuLuc: { loaiFile: ILoaiFileHopDong }[] = newFilesPhuLuc.map(() => ({
      loaiFile: 'FILE_PHU_LUC',
    }));

    const baseInput: IHopDongCreateInput = {
      hopDong: {
        soHopDong: data.soHopDong,
        soHopDongErp: data.soHopDongERP,
        hinhThucKyId: data.hinhThucKy?.id,
        hinhThucDauTuId: data.hinhThucDauTu?.id,
        khoanMucId: !isNull(data.khoanMuc) ? Number(data.khoanMuc?.id) : null,
        doiTuongKyId: data.doiTuongKy?.id,
        coKyQuy: data.coKyQuy,
        giaKyQuy: data.coKyQuy === true ? data.giaKyQuy || null : null,
        ngayKy: data.ngayKy,
        ngayKetThuc: data.ngayKetThuc,
        ghiChu: data.ghiChu,
        thueVat: data.thueVAT || 0,
        hinhThucThanhToanId: data.hinhThucThanhToan?.id,
        chuKyNam: data.chuKyNam,
        chuKyThang: data.chuKyThang,
        chuKyNgay: data.chuKyNgay,
        loaiHopDong: 'MAT_BANG',
        hopDongDoiTac: {
          ten: data.tenDoiTac,
          soDienThoai: data.sdt,
          cccd: data.soCMND,
          maSoThue: data.maSoThue,
          diaChi: data.diaChiLienHe,
          chuTaiKhoan: data.chuTaiKhoan,
          soTaiKhoan: data.soTaiKhoan,
          nganHangChiNhanh: data.nganHangChiNhanh,
        },
        hopDongTramList: data.hangMucs
          .filter((hm) => hm.tram.id && hm.giaThueTram)
          .map((hm) => ({
            tramId: hm.tram.id as number,
            giaThue: hm.giaThueTram,
            giaDienKhoan: hm.dienKhoan.added ? hm.dienKhoan.gia : null,
            ngayBatDauYeuCauThanhToan: hm.ngayBatDauTT,
            hopDongTramKyThanhToanList: hm.hopDongKyThanhToanList
              .filter((ky) => ky.tuNgay && ky.denNgay && ky.gia && ky.daThanhToanNgay === null)
              .map((ky) => ({
                tuNgay: new Date(ky.tuNgay),
                denNgay: new Date(ky.denNgay),
                giaTien: ky.gia,
                daThanhToanNgay: ky.daThanhToan ? new Date(ky.tuNgay) : null,
              })),
            hopDongTramDungChung: hm.isDungChung
              ? {
                  loaiHangMucCSHTId: hm.loaiHangMucCsht?.id || null,
                  maTramDonViDungChung: hm.maDonViDungChung || '',
                  donViDungChungId: !isNull(hm.donViDungChung)
                    ? Number(hm.donViDungChung?.id)
                    : null,
                  ngayLapDatThietBi: hm.ngayLapDatThietBi ? new Date(hm.ngayLapDatThietBi) : null,
                  thoiDiemPhatSinh: hm.thoiDiemPhatSinh ? new Date(hm.thoiDiemPhatSinh) : null,
                  ngayBatDauDungChung: hm.ngayBatDauDungChung
                    ? new Date(hm.ngayBatDauDungChung)
                    : null,
                  ngayKetThucDungChung: hm.ngayKetThucDungChung
                    ? new Date(hm.ngayKetThucDungChung)
                    : null,
                }
              : null,
            hopDongTramPhuTroList: hm.phuTroList
              .filter((pt) => typeof pt.gia !== 'string' || pt.dmPhuTroId)
              .map((pt) => ({
                gia: pt.gia || 0,
                hienThiThongTinChiTiet: pt.hienThiThongTinChiTiet,
                dmPhuTroId: pt.dmPhuTroId || 0,
              })),
          })),
        hopDongPhuLucModels: null,
        hopDongFileModels: null,
      },
      files: concat(newFilesDinhKem, newFilesGiayToSuHuu, newFilesDungChung, newFilesPhuLuc),
      infoFiles: concat(
        infoFilesDinhKem,
        infoFilesGiayToSoHuu,
        infoFilesDungChung,
        infoFilesPhuLuc
      ),
    };

    if (formType === 'create') {
      const createInput: IHopDongCreateInput = {
        ...baseInput,
      };
      handleCreating(createInput, data);
    } else if (formType === 'update' && data.id) {
      const updateInput: IHopDongUpdateInput = {
        ...baseInput,
        hopDong: {
          ...baseInput.hopDong,
          ...((newFilesPhuLuc.length > 0 || data.ghiChuPhuLuc) && {
            hopDongPhuLucModels: [{ ghiChu: data.ghiChuPhuLuc || '' }],
          }),
          hopDongFileModels: concat(
            oldFilesDinhKem,
            oldFilesGiayToSoHuu,
            // oldFilesDungChung,
            oldFilesPhuLuc
          ),
        },
      };

      handleUpdating(updateInput, data);
    }
  };

  const handleClose = () => {
    onClose(false);
  };

  return (
    <Drawer
      disableEscapeKeyDown
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{ backdrop: { invisible: true, onClick: () => {} } }}
      PaperProps={{
        sx: {
          width: WIDTH_DRAWER,
        },
      }}
      // sx={{ zIndex: theme.zIndex.di }}
    >
      <Scrollbar>
        {isFetching || preparing ? (
          <Box
            sx={{ width: '100%', height: '100vh' }}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <CircularProgress />
          </Box>
        ) : (
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit, onError)}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ pl: 2, pr: 1, py: 2 }}
            >
              <Typography variant="subtitle1">
                {formType === 'create' ? 'Thêm mới hợp đồng' : 'Cập nhật hợp đồng'}
              </Typography>
              <div>
                <IconButton onClick={handleClose}>
                  <Iconify icon="eva:close-fill" />
                </IconButton>
              </div>
            </Stack>

            <Divider />

            <div style={{ margin: '20px 20px 0', textAlign: 'right' }}>
              <LoadingButton
                variant="contained"
                type="submit"
                color="primary"
                disabled={creating || updating}
                loading={creating || updating}
              >
                {formType === 'create' ? 'Tạo mới' : 'Lưu thay đổi'}
              </LoadingButton>
            </div>

            <Box sx={{ p: SPACING }}>
              <Stack direction="row" spacing={2} mb={2} justifyContent="flex-start">
                <SoHopDongField />
                <SoHopDongErpField />
              </Stack>
              <Stack direction="row" spacing={2} mb={2} alignItems="start">
                <HinhThucKyHopDongField />
                <HinhThucDauTuField />
              </Stack>
              <Stack direction="row" spacing={2} mb={2} alignItems="start">
                <DoiTuongKyHopDongField />
                <KhoanMucField />
              </Stack>
              <Stack direction="row" spacing={2} mb={2} justifyContent="flex-start">
                <NgayKyHopDongField />
                <NgayKetThucHopDongField />
              </Stack>

              <Stack direction="row" spacing={2} mb={2} alignItems="center">
                <KyQuyField isCoKyQuy={wCoKyQuy} />
              </Stack>
              <Stack direction="row" spacing={2} mb={2} alignItems="center">
                <ThueVATField />
                <ChuKyField />
              </Stack>
              <Stack direction="row" spacing={2} mb={2}>
                <GhiChuField />
              </Stack>
              <Stack>
                <Box width="100%">
                  <Typography variant="subtitle1" sx={{ color: 'black' }}>
                    Tổng tiền (+VAT)/tháng:{' '}
                    {fCurrencyVND(
                      wHangMucs.reduce(
                        (acc, currentValue) => acc + Number(currentValue.giaThueTram),
                        0
                      )
                    )}{' '}
                    (VNĐ)
                  </Typography>
                </Box>
              </Stack>
            </Box>
            <TabsHopDong onClose={handleClose} isSubmitting={creating || updating} />

            <ConfirmDialog
              open={openConfirm}
              onClose={() => {
                handleCloseConfirm();
              }}
              title="Xác nhận"
              content={
                hopDongId
                  ? 'Bạn có chắc chắn muốn cập nhật hợp đồng'
                  : 'Bạn có chắc chắn muốn tạo hợp đồng'
              }
              action={
                <LoadingButton
                  variant="contained"
                  type="submit"
                  color="primary"
                  loading={creating || updating}
                  onClick={handleSubmit(onSubmit)}
                >
                  {formType === 'create' ? 'Tạo mới' : 'Lưu thay đổi'}
                </LoadingButton>
              }
            />
          </FormProvider>
        )}
      </Scrollbar>
    </Drawer>
  );
}
