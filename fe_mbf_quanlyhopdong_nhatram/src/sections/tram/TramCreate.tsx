import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import equal from 'fast-deep-equal';
import isNil from 'lodash/isNil';
import isNull from 'lodash/isNull';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { IDmHuyen, IDmTo, IDmXa } from 'src/@types/category';
import { OptionTypeTram } from 'src/@types/common';
import { ITramForm, ITramInput } from 'src/@types/tram';
import ConfirmDialog from 'src/components/confirm-dialog/ConfirmDialog';
import { RHFAutocomplete, RHFCheckbox, RHFSwitch, RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/FormProvider';
import RHFDatePicker from 'src/components/hook-form/RHFDatePicker';
import Iconify from 'src/components/iconify/Iconify';
import Scrollbar from 'src/components/scrollbar/Scrollbar';
import { useCreateTramContext } from 'src/context/tram/createTramContext';
import { useDmHuyensQuery } from 'src/data/dmHuyen';
import { useDmLoaiCotAntensQuery } from 'src/data/dmLoaiCotAnten';
import { useDmLoaiCshtsQuery } from 'src/data/dmLoaiCsht';
import { useDmLoaiThietBiRansQuery } from 'src/data/dmLoaiThietBiRan';
import { useDmLoaiTramsQuery } from 'src/data/dmLoaiTram';
import { useDmPhongDaisQuery } from 'src/data/dmPhongDai';
import { useDmTinhsQuery } from 'src/data/dmTinh';
import { useDmTosQuery } from 'src/data/dmTo';
import { useDmTramKhuVucsQuery } from 'src/data/dmTramKhuVuc';
import { useDmXasQuery } from 'src/data/dmXa';
import { useCreateTramMutation, useUpdateTramMutation } from 'src/data/tram';
import { getAuthCredentials } from 'src/utils/authUtils';
import { TramSchema } from './validate';

// ----------------------------------------------------------------------
type ICreateTram = {
  open: boolean;
  onClose: VoidFunction;
  onSaveSuccess: VoidFunction;
  title: string;
  initData?: ITramForm | null;
};
const SPACING = 2.5;
const WIDTH_DRAWER = 760;
const DEFAULT_TINH = 1;
const DEFAULT_HUYEN = 1;
export default function TramCreate({
  open,
  onClose,
  onSaveSuccess,
  title,
  initData,
  ...other
}: ICreateTram) {
  const {
    state: { agreeLastConfirm },
    dispatch,
  } = useCreateTramContext();
  const [openConfirm, setOpenConfirm] = useState(false);
  // Id selected
  const [idPhongDaiSelected, setIdPhongDaiSelected] = useState<OptionTypeTram>({
    id: initData?.dmPhongDai?.id || '',
    ten: initData?.dmPhongDai?.ten || '',
  });
  const [idTinhSelected, setIdTinhSelected] = useState<OptionTypeTram>({
    id: initData?.dmTinh?.id || '',
    ten: initData?.dmTinh?.ten || '',
  });
  const [idHuyenSelected, setIdHuyenSelected] = useState<OptionTypeTram>({
    id: initData?.dmHuyen?.id || '',
    ten: initData?.dmHuyen?.ten || '',
  });

  // List data
  const [dataTo, setDataTo] = useState<IDmTo[]>([]);
  const [pdOptions, setPdOptions] = useState<OptionTypeTram[]>([]);
  const [dataHuyen, setDataHuyen] = useState<IDmHuyen[]>([]);
  const [dataXa, setDataXa] = useState<IDmXa[]>([]);
  // Lấy data các danh mục
  const { data: listDataPhongDai } = useDmPhongDaisQuery({ refetchOnWindowFocus: false });
  const { data: listDataTo } = useDmTosQuery({ refetchOnWindowFocus: false });
  const { data: listDataTinh } = useDmTinhsQuery({ refetchOnWindowFocus: false });
  const { data: listDataHuyen } = useDmHuyensQuery(Number(idTinhSelected?.id) || DEFAULT_TINH, {
    refetchOnWindowFocus: false,
  });
  const { data: listDataXa } = useDmXasQuery(Number(idHuyenSelected?.id) || DEFAULT_HUYEN, {
    refetchOnWindowFocus: false,
  });
  const { data: listDataKhuVuc } = useDmTramKhuVucsQuery({ refetchOnWindowFocus: false });
  const { data: listDataLoaiCsht } = useDmLoaiCshtsQuery({ refetchOnWindowFocus: false });
  const { data: listDataLoaiTram } = useDmLoaiTramsQuery({ refetchOnWindowFocus: false });
  const { data: listDataLoaiThietBiRan } = useDmLoaiThietBiRansQuery({
    refetchOnWindowFocus: false,
  });
  const { data: listDataLoaiCotAnten } = useDmLoaiCotAntensQuery({
    refetchOnWindowFocus: false,
  });

  // set pd option
  useEffect(() => {
    const { profile } = getAuthCredentials();
    let newPdOptions: OptionTypeTram[] = [];
    if (listDataPhongDai) {
      if (profile?.email === 'superadmin@mobifone.vn') {
        newPdOptions = listDataPhongDai.elements.map((pd) => ({
          id: pd.id.toString(),
          ten: pd.ten,
        }));
      } else {
        newPdOptions = listDataPhongDai.elements
          .filter(
            (pd) =>
              (profile?.nguoiDungKhuVucList
                ? profile?.nguoiDungKhuVucList.filter((kv) => kv?.dmPhongDai?.id === pd.id)
                    ?.length > 0
                : false) && pd.loai === 'Đài'
          )
          .map((pd) => ({ id: pd.id.toString(), ten: pd.ten }));
      }
    }
    if (!equal(pdOptions, newPdOptions)) {
      setPdOptions(newPdOptions);
    }
  }, [listDataPhongDai, pdOptions]);

  useEffect(() => {
    if (
      !isNil(listDataTo) &&
      !equal(listDataTo, dataTo) &&
      idPhongDaiSelected &&
      idPhongDaiSelected.id !== ''
    ) {
      const filterTo = listDataTo.elements.filter(
        (item) => item.phongDai.id?.toString() === idPhongDaiSelected.id
      );
      setDataTo(filterTo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idPhongDaiSelected?.id]);
  useEffect(() => {
    if (listDataHuyen?.elements.length) {
      setDataHuyen(listDataHuyen.elements);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listDataHuyen]);
  useEffect(() => {
    if (listDataXa?.elements.length) {
      setDataXa(listDataXa.elements);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listDataXa]);
  const defaultValues = {
    maTram: '',
    maDTXD: '',
    maTramErp: '',
    siteNameErp: '',
    ten: '',
    dmPhongDai: null,
    dmTo: null,
    dmTinh: null,
    dmHuyen: null,
    dmXa: null,
    dmTramKhuVuc: null,
    diaChi: '',
    kinhDo: '',
    viDo: '',
    ngayPhatSong: null,
    dmLoaiCsht: null,
    dmLoaiTram: null,
    dmLoaiCotAngten: null,
    doCaoAngten: 0,
    dmLoaiThietBiRanList: [],
    trangThaiHoatDong: true,
    daPhatSong: false,
    ghiChu: '',
  };
  const methods = useForm<ITramForm>({
    resolver: yupResolver(TramSchema),
    defaultValues: initData || defaultValues,
  });
  const { reset, setValue, handleSubmit, watch } = methods;
  const wDaPhatSong = watch('daPhatSong');
  const wPhongDai = watch('dmPhongDai');
  const wTinh = watch('dmTinh');
  const wHuyen = watch('dmHuyen');
  const { enqueueSnackbar } = useSnackbar();
  const { mutate: createTram, isLoading: creating } = useCreateTramMutation();
  const { mutate: updateTram, isLoading: updating } = useUpdateTramMutation();

  const handleOpenConfirm = () => {
    dispatch({ type: 'set-agree-last-confirm', payload: true });
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    dispatch({ type: 'set-agree-last-confirm', payload: false });
    setOpenConfirm(false);
  };

  const onSubmit = async (data: ITramForm) => {
    if (!agreeLastConfirm) {
      handleOpenConfirm();
      return;
    }

    const inputData: ITramInput = {
      phongDaiId: Number(data.dmPhongDai?.id),
      toId: Number(data.dmTo?.id),
      maTram: data.maTram,
      maTramErp: data.maTramErp,
      siteNameErp: data.siteNameErp,
      ten: data.ten,
      maDauTuXayDung: data.maDTXD,
      tinhId: Number(data.dmTinh?.id),
      huyenId: Number(data.dmHuyen?.id),
      xaId: Number(data.dmXa?.id),
      diaChi: data.diaChi,
      kinhDo: data.kinhDo || '',
      viDo: data.viDo || '',
      khuVucId: Number(data.dmTramKhuVuc?.id),
      ngayPhatSong: data.ngayPhatSong ? new Date(data.ngayPhatSong) : null,
      loaiCshtId: Number(data.dmLoaiCsht?.id),
      loaiTramId: Number(data.dmLoaiTram?.id),
      loaiCotAngtenId: Number(data.dmLoaiCotAngten?.id),
      doCaoAngten: Number(data.doCaoAngten),
      dmLoaiThietBiRanList: data.dmLoaiThietBiRanList as OptionTypeTram[],
      ghiChu: data.ghiChu,
      trangThaiHoatDong: data.trangThaiHoatDong ? 'HOAT_DONG' : 'NGUNG_HOAT_DONG',
      daPhatSong: data.daPhatSong,
    };
    if (initData && initData.id) {
      updateTram(
        { id: initData.id.toString(), ...inputData },
        {
          onSuccess: () => {
            enqueueSnackbar(`Cập nhật trạm "${data.maTram}" thành công`, {
              variant: 'success',
            });
            reset();
            handleCloseConfirm();
            onSaveSuccess();
          },
          onError: (error: any) => {
            handleCloseConfirm();

            let msg = 'Có lỗi trong quá trình cập nhật trạm';
            if (error?.response?.status === 409) {
              msg = `Mã trạm hoặc mã trạm erp đã tồn tại.\nVui lòng kiểm tra lại.`;
            }
            enqueueSnackbar(msg, {
              variant: 'error',
            });
          },
        }
      );
    } else {
      createTram(inputData, {
        onSuccess: () => {
          enqueueSnackbar(`Thêm mới trạm "${inputData.maTram}" thành công`, {
            variant: 'success',
          });
          reset();
          onSaveSuccess();
        },
        onError: (error: any) => {
          let msg = 'Có lỗi trong quá trình thêm mới trạm';
          if (error?.response?.status === 409) {
            msg = `Mã trạm hoặc mã trạm erp đã tồn tại.\nVui lòng kiểm tra lại.`;
          }
          enqueueSnackbar(msg, {
            variant: 'error',
          });
        },
      });
    }
  };
  /**
   * * Theo dỗi sự thay đổi của tỉnh và phòng đài
   * * Để khi có lỗi người dùng change value input sẽ không hiện lỗi nữa
   * * Đồng thời call api để lấy child của tổ và phòng đài
   */

  useEffect(() => {
    if (!isNull(wPhongDai)) {
      setIdPhongDaiSelected(wPhongDai);
    } else {
      setDataTo([]);
      setValue('dmTo', null);
    }
  }, [setValue, wPhongDai]);
  useEffect(() => {
    if (!isNull(wTinh)) {
      setIdTinhSelected(wTinh);
    } else {
      setDataHuyen([]);
      setDataXa([]);
      setValue('dmHuyen', null);
      setValue('dmXa', null);
    }
  }, [setValue, wTinh]);
  useEffect(() => {
    if (!isNull(wHuyen)) {
      setIdHuyenSelected(wHuyen);
    } else {
      setDataXa([]);
      setValue('dmXa', null);
    }
  }, [setValue, wHuyen]);
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      BackdropProps={{ invisible: true, onClick: () => {} }}
      PaperProps={{
        sx: {
          width: WIDTH_DRAWER,
        },
      }}
    >
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ py: 2, pr: 1, pl: SPACING }}
        >
          <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>

          <IconButton onClick={onClose}>
            <Iconify icon="eva:close-fill" />
          </IconButton>
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Scrollbar sx={{ p: SPACING, pb: 0 }}>
          <Stack direction="row" spacing={2} mb={4} justifyContent="flex-end">
            <LoadingButton
              variant="contained"
              type="submit"
              color="primary"
              loading={creating || updating}
            >
              {initData ? 'Lưu thay đổi' : 'Tạo mới'}
            </LoadingButton>
          </Stack>
          <Stack direction="row" spacing={2} mb={4} alignItems="flex-start">
            <Box sx={{ width: '100%' }}>
              <Typography
                variant="overline"
                component="p"
                gutterBottom
                sx={{ textTransform: 'none' }}
              >
                Đài{' '}
                <Typography component="span" sx={{ color: 'red' }}>
                  (*)
                </Typography>
              </Typography>
              <RHFAutocomplete
                fullWidth
                name="dmPhongDai"
                options={pdOptions}
                getOptionLabel={(option: OptionTypeTram | string) => (option as OptionTypeTram).ten}
                isOptionEqualToValue={(option, value) => option.id === value.id}
              />
            </Box>
            <Box sx={{ width: '100%' }}>
              <Typography
                variant="overline"
                component="p"
                gutterBottom
                sx={{ textTransform: 'none' }}
              >
                Tổ <Typography component="span" />
              </Typography>
              <RHFAutocomplete
                fullWidth
                name="dmTo"
                options={dataTo ? dataTo.map((to) => ({ id: to.id.toString(), ten: to.ten })) : []}
                getOptionLabel={(option: OptionTypeTram | string) => (option as OptionTypeTram).ten}
                isOptionEqualToValue={(option, value) => option.id === value.id}
              />
            </Box>
          </Stack>

          <Stack direction="row" spacing={2} mb={4} alignItems="flex-start">
            <Box sx={{ width: '100%' }}>
              <Typography
                variant="overline"
                component="p"
                gutterBottom
                sx={{ textTransform: 'none', display: 'flex', alignItems: 'center', gap: '2px' }}
              >
                Mã trạm{' '}
                <Typography component="span" sx={{ color: 'red' }}>
                  {wDaPhatSong ? '(*)' : ''}
                </Typography>
                <Tooltip
                  title={
                    <Box sx={{ whiteSpace: 'pre-line' }}>
                      Mã trạm là bắt buộc, khi ngày phát sóng có dữ liệu
                    </Box>
                  }
                >
                  <IconButton color="default">
                    <Iconify icon="eva:alert-circle-fill" />
                  </IconButton>
                </Tooltip>
              </Typography>
              <RHFTextField name="maTram" fullWidth />
            </Box>
            <Box sx={{ width: '100%' }}>
              <Typography
                variant="overline"
                component="p"
                gutterBottom
                sx={{ textTransform: 'none', display: 'flex', alignItems: 'center', gap: '2px' }}
              >
                Mã ĐTXD{' '}
                <Typography component="span" sx={{ color: 'red' }}>
                  {!wDaPhatSong ? '(*)' : ''}
                </Typography>
                <Tooltip
                  title={
                    <Box sx={{ whiteSpace: 'pre-line' }}>
                      {`Mã ĐTXD là bắt buộc, khi trường "Đã phát sóng" được chọn`}
                    </Box>
                  }
                >
                  <IconButton color="default">
                    <Iconify icon="eva:alert-circle-fill" />
                  </IconButton>
                </Tooltip>
              </Typography>
              <RHFTextField name="maDTXD" fullWidth />
            </Box>
          </Stack>
          <Stack direction="row" spacing={2} mb={4} alignItems="center">
            <Box sx={{ width: '100%' }}>
              <Typography
                variant="overline"
                component="p"
                gutterBottom
                sx={{ textTransform: 'none' }}
              >
                Ngày phát sóng
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box sx={{ flexBasis: '72%' }}>
                  <RHFDatePicker
                    name="ngayPhatSong"
                    datePickerProps={{ actionBar: { actions: ['clear'] } }}
                  />
                </Box>
                <RHFCheckbox
                  name="daPhatSong"
                  label="Đã phát sóng"
                  sx={{ flex: 1 }}
                  // checked={initData?.daPhatSong}
                />
              </Stack>
            </Box>
          </Stack>
          <Stack direction="row" spacing={2} mb={4}>
            <Box sx={{ width: '100%' }}>
              <Typography
                variant="overline"
                component="p"
                gutterBottom
                sx={{ textTransform: 'none' }}
              >
                Tên trạm
              </Typography>
              <RHFTextField name="ten" fullWidth />
            </Box>
          </Stack>
          <Stack direction="row" spacing={2} mb={4}>
            <Box sx={{ width: '100%' }}>
              <Typography
                variant="overline"
                component="p"
                gutterBottom
                sx={{ textTransform: 'none' }}
              >
                Mã trạm ERP
              </Typography>
              <RHFTextField name="maTramErp" fullWidth />
            </Box>
            <Box sx={{ width: '100%' }}>
              <Typography
                variant="overline"
                component="p"
                gutterBottom
                sx={{ textTransform: 'none' }}
              >
                Site Name ERP
              </Typography>
              <RHFTextField name="siteNameErp" fullWidth />
            </Box>
          </Stack>

          <Stack direction="row" spacing={2} mb={4} alignItems="flex-start">
            <Box sx={{ width: '100%' }}>
              <Typography
                variant="overline"
                component="p"
                gutterBottom
                sx={{ textTransform: 'none' }}
              >
                Tỉnh/TP{' '}
                <Typography component="span" sx={{ color: 'red' }}>
                  (*)
                </Typography>
              </Typography>
              <RHFAutocomplete
                fullWidth
                name="dmTinh"
                options={
                  listDataTinh
                    ? listDataTinh.elements.map((tinh) => ({
                        id: tinh.id.toString(),
                        ten: tinh.ten,
                      }))
                    : []
                }
                getOptionLabel={(option: OptionTypeTram | string) => (option as OptionTypeTram).ten}
                isOptionEqualToValue={(option, value) => option.id === value.id}
              />
            </Box>
            <Box sx={{ width: '100%' }}>
              <Typography
                variant="overline"
                component="p"
                gutterBottom
                sx={{ textTransform: 'none' }}
              >
                Quận/Huyện <Typography component="span" />
              </Typography>
              <RHFAutocomplete
                fullWidth
                name="dmHuyen"
                options={
                  dataHuyen
                    ? dataHuyen.map((huyen) => ({
                        id: huyen.id.toString(),
                        ten: huyen.ten,
                      }))
                    : []
                }
                getOptionLabel={(option: OptionTypeTram | string) => (option as OptionTypeTram).ten}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(e, newValue) => {
                  setValue('dmHuyen', newValue as OptionTypeTram);
                  setIdHuyenSelected(newValue as OptionTypeTram);
                }}
              />
            </Box>
          </Stack>

          <Stack direction="row" spacing={2} mb={4} alignItems="flex-start">
            <Box sx={{ width: '100%' }}>
              <Typography
                variant="overline"
                component="p"
                gutterBottom
                sx={{ textTransform: 'none' }}
              >
                Phường/Xã <Typography component="span" />
              </Typography>
              <RHFAutocomplete
                fullWidth
                name="dmXa"
                options={dataXa ? dataXa.map((xa) => ({ id: xa.id.toString(), ten: xa.ten })) : []}
                getOptionLabel={(option: OptionTypeTram | string) => (option as OptionTypeTram).ten}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(e, newValue) => {
                  setValue('dmXa', newValue as OptionTypeTram);
                }}
              />
            </Box>
            <Box sx={{ width: '100%' }}>
              <Typography
                variant="overline"
                component="p"
                gutterBottom
                sx={{ textTransform: 'none' }}
              >
                Khu vực <Typography component="span" />
              </Typography>
              <RHFAutocomplete
                fullWidth
                name="dmTramKhuVuc"
                options={
                  listDataKhuVuc
                    ? listDataKhuVuc.elements.map((khuvuc) => ({
                        id: khuvuc.id.toString(),
                        ten: khuvuc.ten,
                      }))
                    : []
                }
                getOptionLabel={(option: OptionTypeTram | string) => (option as OptionTypeTram).ten}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(e, newValue) => {
                  setValue('dmTramKhuVuc', newValue as OptionTypeTram);
                }}
              />
            </Box>
          </Stack>

          <Stack direction="row" spacing={2} mb={4} alignItems="flex-start">
            <Box sx={{ width: '100%' }}>
              <Typography
                variant="overline"
                component="p"
                gutterBottom
                sx={{ textTransform: 'none' }}
              >
                Địa chỉ đặt trạm <Typography component="span" />
              </Typography>
              <RHFTextField name="diaChi" fullWidth multiline minRows={3} maxRows={10} />
            </Box>
          </Stack>

          <Stack direction="row" spacing={2} mb={4} alignItems="flex-start">
            <Box sx={{ width: '100%' }}>
              <Typography
                variant="overline"
                component="p"
                gutterBottom
                sx={{ textTransform: 'none' }}
              >
                Kinh Độ{' '}
              </Typography>
              <RHFTextField name="kinhDo" fullWidth />
            </Box>
            <Box sx={{ width: '100%' }}>
              <Typography
                variant="overline"
                component="p"
                gutterBottom
                sx={{ textTransform: 'none' }}
              >
                Vĩ độ{' '}
              </Typography>
              <RHFTextField name="viDo" fullWidth />
            </Box>
          </Stack>

          <Stack direction="row" spacing={2} mb={4} alignItems="flex-start">
            <Box sx={{ width: '100%' }}>
              <Typography
                variant="overline"
                component="p"
                gutterBottom
                sx={{ textTransform: 'none' }}
              >
                Loại CSHT <Typography component="span" />
              </Typography>
              <RHFAutocomplete
                fullWidth
                name="dmLoaiCsht"
                options={
                  listDataLoaiCsht
                    ? listDataLoaiCsht.elements.map((loaicsht) => ({
                        id: loaicsht.id.toString(),
                        ten: loaicsht.ten,
                      }))
                    : []
                }
                getOptionLabel={(option: OptionTypeTram | string) => (option as OptionTypeTram).ten}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(e, newValue) => {
                  setValue('dmLoaiCsht', newValue as OptionTypeTram);
                }}
              />
            </Box>
            <Box sx={{ width: '100%' }}>
              <Typography
                variant="overline"
                component="p"
                gutterBottom
                sx={{ textTransform: 'none' }}
              >
                Loại thiết bị RAN <Typography component="span" />
              </Typography>
              <RHFAutocomplete
                fullWidth
                multiple
                name="dmLoaiThietBiRanList"
                options={
                  listDataLoaiThietBiRan
                    ? listDataLoaiThietBiRan.elements.map((loairan) => ({
                        id: loairan.id.toString(),
                        ten: loairan.ten,
                      }))
                    : []
                }
                getOptionLabel={(option: OptionTypeTram | string) => (option as OptionTypeTram).ten}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(e, newValue) => {
                  setValue('dmLoaiThietBiRanList', newValue as OptionTypeTram[]);
                }}
              />
            </Box>
          </Stack>

          <Stack direction="row" spacing={2} mb={4} alignItems="flex-start">
            <Box sx={{ width: '50%' }}>
              <Typography
                variant="overline"
                component="p"
                gutterBottom
                sx={{ textTransform: 'none' }}
              >
                Loại trạm <Typography component="span" />
              </Typography>
              <RHFAutocomplete
                fullWidth
                name="dmLoaiTram"
                options={
                  listDataLoaiTram
                    ? listDataLoaiTram.elements.map((loaitram) => ({
                        id: loaitram.id.toString(),
                        ten: loaitram.ten,
                      }))
                    : []
                }
                getOptionLabel={(option: OptionTypeTram | string) => (option as OptionTypeTram).ten}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(e, newValue) => {
                  setValue('dmLoaiTram', newValue as OptionTypeTram);
                }}
              />
            </Box>
          </Stack>

          <Stack direction="row" spacing={2} mb={4} alignItems="flex-start">
            <Box sx={{ width: '100%' }}>
              <Typography
                variant="overline"
                component="p"
                gutterBottom
                sx={{ textTransform: 'none' }}
              >
                Loại cột anten <Typography component="span" />
              </Typography>
              <RHFAutocomplete
                fullWidth
                name="dmLoaiCotAngten"
                options={
                  listDataLoaiCotAnten
                    ? listDataLoaiCotAnten.elements.map((loaicotanten) => ({
                        id: loaicotanten.id.toString(),
                        ten: loaicotanten.ten,
                      }))
                    : []
                }
                getOptionLabel={(option: OptionTypeTram | string) => (option as OptionTypeTram).ten}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(e, newValue) => {
                  setValue('dmLoaiCotAngten', newValue as OptionTypeTram);
                }}
              />
            </Box>
            <Box sx={{ width: '100%' }}>
              <Typography
                variant="overline"
                component="p"
                gutterBottom
                sx={{ textTransform: 'none' }}
              >
                Độ cao cột anten <Typography component="span" />
              </Typography>
              <RHFTextField name="doCaoAngten" fullWidth />
            </Box>
          </Stack>
          <Stack direction="row" mb={4} spacing={1}>
            <RHFSwitch
              name="trangThaiHoatDong"
              sx={{ ml: 0 }}
              label={
                <Typography
                  variant="overline"
                  component="p"
                  sx={{ textTransform: 'none', mb: '4px' }}
                >
                  Trạng thái hoạt động{' '}
                  <Typography component="span" sx={{ color: 'red' }}>
                    (*)
                  </Typography>
                </Typography>
              }
              labelPlacement="start"
              checked={initData?.trangThaiHoatDong}
            />
          </Stack>

          <Stack direction="row" spacing={2} mb={4}>
            <Box sx={{ width: '100%' }}>
              <Typography
                variant="overline"
                component="p"
                gutterBottom
                sx={{ textTransform: 'none' }}
              >
                Ghi chú
              </Typography>
              <RHFTextField name="ghiChu" fullWidth multiline minRows={3} maxRows={10} />
            </Box>
          </Stack>

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button variant="outlined" color="inherit" onClick={onClose}>
              Đóng
            </Button>
            <LoadingButton
              variant="contained"
              type="submit"
              color="primary"
              loading={creating || updating}
            >
              {initData ? 'Lưu thay đổi' : 'Tạo mới'}
            </LoadingButton>
          </Stack>
        </Scrollbar>

        <ConfirmDialog
          open={openConfirm}
          onClose={() => {
            handleCloseConfirm();
          }}
          title="Xác nhận"
          content={
            initData ? 'Bạn có chắc chắn muốn cập nhật trạm' : 'Bạn có chắc chắn muốn tạo trạm'
          }
          action={
            <LoadingButton
              variant="contained"
              type="submit"
              color="primary"
              loading={creating || updating}
              onClick={handleSubmit(onSubmit)}
            >
              {initData ? 'Lưu thay đổi' : 'Tạo mới'}
            </LoadingButton>
          }
        />
      </FormProvider>
    </Drawer>
  );
}
