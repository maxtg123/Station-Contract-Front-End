import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  Stack,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useForm } from 'react-hook-form';
import { IDmPhongDai } from 'src/@types/category';
import { RHFAutocomplete, RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/FormProvider';
import { useCreateDmPhongDaiMutation, useUpdateDmPhongDaiMutation } from 'src/data/dmPhongDai';
import * as Yup from 'yup';

const OPTION_LOAI_PHONG_DAI = ['Phòng', 'Đài'];
interface Props extends Omit<DialogProps, 'title'> {
  title: React.ReactNode;
  open: boolean;
  onClose: VoidFunction;
  initData?: IDmPhongDai | null;
  onCreate?: VoidFunction;
}
type FormValuesProps = {
  ten: string;
  tenVietTat: string;
  maDataSite: string;
  loai: 'Đài' | 'Phòng' | string;
  ghiChu: string;
  afterSubmit?: string;
};
export default function PhongDaiCreate({
  title,
  open,
  onClose,
  initData,
  onCreate,
  ...other
}: Props) {
  const loaiCotAntenSchema = Yup.object().shape({
    ten: Yup.string().required('Tên là trường bắt buộc'),
    tenVietTat: Yup.string().required('Tên viết tắt là trường bắt buộc'),
    maDataSite: Yup.string(),
    loai: Yup.string().required('Loại là trường bắt buộc').nullable(),
  });
  const defaultValues = {
    ten: initData?.ten || '',
    tenVietTat: initData?.tenVietTat || '',
    maDataSite: initData?.maDataSite || '',
    loai: initData?.loai,
    ghiChu: initData?.ghiChu || '',
  };
  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(loaiCotAntenSchema),
    defaultValues,
  });

  const { reset, handleSubmit } = methods;

  const { enqueueSnackbar } = useSnackbar();

  const { mutate: createPhongDai, isLoading: creating } = useCreateDmPhongDaiMutation();
  const { mutate: updatePhongDai, isLoading: updating } = useUpdateDmPhongDaiMutation();

  const onSubmit = async (data: FormValuesProps) => {
    if (initData) {
      updatePhongDai(
        { id: initData.id.toString(), ...data },
        {
          onSuccess: () => {
            enqueueSnackbar(`Cập nhật Phòng đài "${data.ten}" thành công`, {
              variant: 'success',
            });
            reset();
            onClose();
          },
          onError: () => {
            enqueueSnackbar(`Có lỗi trong quá trình cập nhật Phòng đài`, {
              variant: 'error',
            });
          },
        }
      );
    } else {
      createPhongDai(
        {
          ...data,
        },
        {
          onSuccess: () => {
            enqueueSnackbar(`Thêm mới Phòng đài "${data.ten}" thành công`, {
              variant: 'success',
            });
            reset();
            onClose();
          },
          onError: () => {
            enqueueSnackbar(`Có lỗi trong quá trình thêm mới Phòng đài`, {
              variant: 'error',
            });
          },
        }
      );
    }
  };
  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose} {...other}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle sx={{ pb: 2 }}>{title}</DialogTitle>
        <DialogContent sx={{ typography: 'body2' }}>
          <Stack spacing={3} mt={2}>
            <RHFTextField name="ten" label="Tên (*)" />
            <RHFTextField name="tenVietTat" label="Tên viết tắt (*)" />
            <RHFTextField name="maDataSite" label="Mã DataSite" />
            <RHFAutocomplete
              name="loai"
              label="Loại"
              options={OPTION_LOAI_PHONG_DAI.map((option) => option)}
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
            loading={creating || updating}
          >
            Lưu
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
