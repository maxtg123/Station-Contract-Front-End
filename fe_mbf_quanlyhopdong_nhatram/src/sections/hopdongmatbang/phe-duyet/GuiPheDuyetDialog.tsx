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
import isNil from 'lodash/isNil';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { OptionTypeUser } from 'src/@types/common';
import { ICreatePheDuyetHopDongInput, IHopDong } from 'src/@types/hopdongmatbang';
import { ISendMailPheDuyet } from 'src/@types/sendmail';
import { CustomAvatar } from 'src/components/custom-avatar';
import { RHFAutocomplete, RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/FormProvider';
import { useNguoiDungsQuery } from 'src/data/nguoidung';
import { useCreateHopDongPheDuyetMutation } from 'src/data/pheduyetHopDong';
import { useSendMailPheDuyetHopDong } from 'src/data/sendMail';
import useAuthCredentials from 'src/hooks/useAuthCredentials';
import * as Yup from 'yup';

type FormValuesProps = {
  nguoiPheDuyet: OptionTypeUser[] | [];
  ghiChu: string;
  afterSubmit?: string;
};

interface Props extends Omit<DialogProps, 'title'> {
  title: React.ReactNode;
  open: boolean;
  onClose: VoidFunction;
  onSuccess: VoidFunction;
  selectedRow: IHopDong[];
}

export default function GuiPheDuyetDialog({
  title,
  open,
  onClose,
  onSuccess,
  selectedRow,
  ...other
}: Props) {
  const { profile, pdChinh } = useAuthCredentials();
  const [userOptions, setUserOptions] = useState<OptionTypeUser[]>([]);

  const { data } = useNguoiDungsQuery({ refetchOnWindowFocus: false });
  const { mutate: createHDPheDuyet, isLoading: creating } = useCreateHopDongPheDuyetMutation();
  const { mutate: sendMail } = useSendMailPheDuyetHopDong();
  const guiPheDuyetHopDongSchema = Yup.object().shape({
    nguoiPheDuyet: Yup.array()
      .required('Người phê duyệt là trường bắt buộc')
      .min(1, 'Số lượng người được phê duyệt phải lớn hơn 1'),
  });
  const defaultValues = {
    nguoiPheDuyet: [],
    ghiChu: '',
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
      const nguoiCoQuyenPheDuyetHD = data?.elements.filter(
        (dt) =>
          dt.trangThai === 'HOAT_DONG' &&
          !!dt?.nguoiDungKhuVucList?.find(
            (kv) =>
              !!kv?.chucVu?.chucVuPhanQuyenList.find(
                (q) => q.module === 'HOP_DONG' && q.action === 'XET_DUYET'
              ) &&
              kv.dmPhongDai?.id &&
              selectedRow[0].hopDongTramList
                .map((hdTram) => hdTram.tram.dmPhongDai.id)
                .includes(kv.dmPhongDai?.id)
          )
      );

      if (nguoiCoQuyenPheDuyetHD && nguoiCoQuyenPheDuyetHD.length) {
        const tranformData = nguoiCoQuyenPheDuyetHD.map((el) => ({
          id: el.id.toString(),
          email: el.email,
          ten: el.hoTen,
        }));
        setUserOptions(tranformData);
      }
    }
  }, [data, selectedRow]);

  const onSubmit = async (values: FormValuesProps) => {
    const input: ICreatePheDuyetHopDongInput = {
      ghiChu: values.ghiChu || '',
      hopDongIdList: selectedRow.map((hd) => hd.id),
      nguoiPheDuyetIdList: values.nguoiPheDuyet.map((u) => Number(u.id)),
    };
    const transformDataSendmail: ISendMailPheDuyet = {
      nguoiGui: {
        email: profile?.email ?? '',
        name: profile?.hoTen ?? '',
        phone: profile?.soDienThoai ?? '',
        phongDai: pdChinh?.dmPhongDai?.ten ?? '',
      },
      nguoiPheDuyet: values.nguoiPheDuyet.map((item) => ({ email: item.email, name: item.ten })),
      // TODO more tram
      listHopDong: selectedRow.map((hd) => ({
        id: hd.id,
        soHopDong: hd.soHopDong,
        maTram: hd.hopDongTramList.map((item) => item.tram.maTram).filter(Boolean),
        maDTXD: hd.hopDongTramList.map((item) => item.tram.maDauTuXayDung).filter(Boolean),
      })),
      type: 'hop-dong-mat-bang',
    };
    createHDPheDuyet(input, {
      onSuccess() {
        enqueueSnackbar(`Gửi hợp đồng đi phê duyệt thành công`, {
          variant: 'success',
        });
        handleSuccess();
      },
      onError: (error: any) => {
        const errorMsg = 'Có lỗi trong quá trình gửi hợp đồng đi phê duyệt';
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
              name="nguoiPheDuyet"
              label="Người phê duyệt (*)"
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
            <RHFTextField name="ghiChu" label="Ghi chú" multiline minRows={3} maxRows={10} />
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
