import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import { addDays } from 'date-fns';
import isNil from 'lodash/isNil';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { OptionTypeUser } from 'src/@types/common';
import { IGiaoViecInput, IMucDoUuTienDamPhan } from 'src/@types/damphan';
import { IHopDong } from 'src/@types/hopdongmatbang';
import { ISendMailGiaoViec } from 'src/@types/sendmail';
import { CustomAvatar } from 'src/components/custom-avatar';
import { RHFAutocomplete, RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/FormProvider';
import RHFDatePicker from 'src/components/hook-form/RHFDatePicker';
import { useGiaoViecDamPhanHopDongMutation } from 'src/data/damPhanHopDong';
import { useNguoiDungsQuery } from 'src/data/nguoidung';
import { useSendMailGiaoViecHopDong } from 'src/data/sendMail';
import useAuthCredentials from 'src/hooks/useAuthCredentials';
import MucDoUuTienDamPhan from 'src/sections/components/hop-dong/chi-tiet-hop-dong/tab-dam-phan/MucDoUuTienDamPhan';
import { fDate } from 'src/utils/formatTime';
import * as Yup from 'yup';

type FormValuesProps = {
  nguoiNhanViec: OptionTypeUser[] | [];
  ghiChu: string;
  mucDoUuTien: IMucDoUuTienDamPhan;
  fromDate: Date | number | null;
  toDate: Date | number | null;
  afterSubmit?: string;
};

interface Props extends Omit<DialogProps, 'title'> {
  title: React.ReactNode;
  open: boolean;
  onClose: VoidFunction;
  onSuccess: VoidFunction;
  selectedRow: IHopDong[];
}
export default function GiaoViecDialog({
  title,
  open,
  onClose,
  onSuccess,
  selectedRow,
  ...other
}: Props) {
  const { profile, pdChinh } = useAuthCredentials();
  const [userOptions, setUserOptions] = useState<OptionTypeUser[]>([]);
  const [valueDoUuTien, setValueDoUuTien] = useState<IMucDoUuTienDamPhan>('LOW');
  const { data } = useNguoiDungsQuery({ refetchOnWindowFocus: false });
  const { mutate: giaoViecDamPhan, isLoading: creating } = useGiaoViecDamPhanHopDongMutation();
  const { mutate: sendMail } = useSendMailGiaoViecHopDong();
  const guiPheDuyetHopDongSchema = Yup.object().shape({
    nguoiNhanViec: Yup.array()
      .required('Người nhận việc là trường bắt buộc')
      .min(1, 'Số lượng người được nhận việc phải lớn hơn 1'),
  });
  const defaultValues = {
    nguoiNhanViec: [],
    ghiChu: '',
    mucDoUuTien: 'LOW' as IMucDoUuTienDamPhan,
    fromDate: null,
    toDate: null,
  };
  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(guiPheDuyetHopDongSchema),
    defaultValues,
  });
  const { enqueueSnackbar } = useSnackbar();

  const { reset, handleSubmit } = methods;

  const handleSuccess = () => {
    onSuccess();
    onClose();
    reset();
  };
  // set pd option
  useEffect(() => {
    if (!isNil(data?.elements)) {
      const nguoiCoQuyenNhanViec = data?.elements.filter(
        (dt) =>
          dt.trangThai === 'HOAT_DONG' &&
          !!dt?.nguoiDungKhuVucList?.find(
            (kv) =>
              !!kv?.chucVu?.chucVuPhanQuyenList.find(
                (q) => q.module === 'DAM_PHAN' && q.action === 'NHAN_VIEC'
              ) &&
              kv.dmPhongDai?.id &&
              selectedRow[0].hopDongTramList
                .map((hdTram) => hdTram.tram.dmPhongDai.id)
                .includes(kv.dmPhongDai?.id)
          )
      );

      if (nguoiCoQuyenNhanViec && nguoiCoQuyenNhanViec.length) {
        const tranformData = nguoiCoQuyenNhanViec.map((el) => ({
          id: el.id.toString(),
          email: el.email,
          ten: el.hoTen,
        }));
        setUserOptions(tranformData);
      }
    }
  }, [data, selectedRow]);
  const handleChangeMucDoUuTien = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValueDoUuTien(event.target.value as IMucDoUuTienDamPhan);
  };
  const onSubmit = async (values: FormValuesProps) => {
    const input: IGiaoViecInput = {
      mucDoUuTien: valueDoUuTien,
      ghiChu: values.ghiChu || '',
      hopDongIdList: selectedRow.map((hd) => hd.id),
      fromDate: addDays(new Date(values.fromDate as Date), 1),
      toDate: addDays(new Date(values.toDate as Date), 1),
      nguoiDamPhanIdList: values.nguoiNhanViec.map((u) => Number(u.id)),
    };
    const transformDataSendmail: ISendMailGiaoViec = {
      nguoiGiaoViec: {
        email: profile?.email ?? '',
        name: profile?.hoTen ?? '',
        phone: profile?.soDienThoai ?? '',
        phongDai: pdChinh?.dmPhongDai?.ten ?? '',
      },
      nguoiNhanViec: values.nguoiNhanViec.map((item) => ({ email: item.email, name: item.ten })),
      listHopDong: selectedRow.map((hd) => ({
        id: hd.id,
        soHopDong: hd.soHopDong,
        maTram: hd.hopDongTramList.map((item) => item.tram.maTram).filter(Boolean),
        maDTXD: hd.hopDongTramList.map((item) => item.tram.maDauTuXayDung).filter(Boolean),
        ngayHetHan: fDate(hd.ngayKetThuc),
      })),
      type: 'hop-dong-mat-bang',
    };
    giaoViecDamPhan(input, {
      onSuccess() {
        enqueueSnackbar(`Giao việc đàm phán hợp đồng thành công`, {
          variant: 'success',
        });
        handleSuccess();
      },
      onError: (error: any) => {
        const errorMsg = 'Có lỗi trong quá trình Giao việc đàm phán hợp đồng';
        enqueueSnackbar(errorMsg, {
          variant: 'error',
        });
      },
    });
    sendMail(transformDataSendmail);
  };
  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose} {...other}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle sx={{ pb: 2 }}>{title}</DialogTitle>
        <DialogContent sx={{ typography: 'body2' }}>
          <Stack spacing={3} mt={2}>
            <RHFAutocomplete
              multiple
              fullWidth
              name="nguoiNhanViec"
              label="Người nhận việc (*)"
              options={userOptions}
              getOptionLabel={(option: OptionTypeUser | string) => (option as OptionTypeUser).email}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CustomAvatar name={option.email} sx={{ width: 30, height: 30 }} />
                    <Typography>{option.email}</Typography>
                  </Stack>
                </Box>
              )}
              renderTags={(selectedUsers, getTagProps) =>
                selectedUsers.map((user, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={user.id}
                    label={user.email}
                    avatar={<CustomAvatar name={user.email} sx={{ width: 30, height: 30 }} />}
                  />
                ))
              }
            />
            <RHFDatePicker name="fromDate" label="Từ ngày" />
            <RHFDatePicker name="toDate" label="Đến ngày" />
            <RHFTextField name="ghiChu" label="Ghi chú" multiline minRows={3} maxRows={10} />

            <Stack direction="column" spacing={1}>
              <Typography>Mức độ ưu tiên</Typography>
              <MucDoUuTienDamPhan
                prioritize={valueDoUuTien}
                onChangePrioritize={handleChangeMucDoUuTien}
              />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="inherit" onClick={onClose}>
            Hủy
          </Button>
          <LoadingButton
            variant="contained"
            type="submit"
            color="primary"
            loading={creating}
            disabled={creating}
          >
            Xác nhận
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
