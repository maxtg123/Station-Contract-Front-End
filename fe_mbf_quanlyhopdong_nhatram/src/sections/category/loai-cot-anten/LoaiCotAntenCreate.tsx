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
import { IDmLoaiCotAnten } from 'src/@types/category';
import { RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/FormProvider';
import {
  useCreateDmLoaiCotAntenMutation,
  useUpdateDmLoaiCotAntenMutation,
} from 'src/data/dmLoaiCotAnten';
import * as Yup from 'yup';

interface Props extends Omit<DialogProps, 'title'> {
  title: React.ReactNode;
  open: boolean;
  onClose: VoidFunction;
  initData?: IDmLoaiCotAnten | null;
  onCreate?: VoidFunction;
}
type FormValuesProps = {
  ten: string;
  ma: string;
  ghiChu: string;
  afterSubmit?: string;
};
export default function LoaiCotAntenCreate({
  title,
  open,
  onClose,
  initData,
  onCreate,
  ...other
}: Props) {
  const loaiCotAntenSchema = Yup.object().shape({
    ten: Yup.string().required('Tên là trường bắt buộc'),
    ma: Yup.string(),
  });
  const defaultValues = {
    ten: initData?.ten || '',
    ma: initData?.ma || '',
    ghiChu: initData?.ghiChu || '',
  };
  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(loaiCotAntenSchema),
    defaultValues,
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState: { isSubmitting, isSubmitSuccessful },
  } = methods;
  const { enqueueSnackbar } = useSnackbar();

  const { mutate: createLoaiCotAnten, isLoading: creating } = useCreateDmLoaiCotAntenMutation();
  const { mutate: updateLoaiCotAnten, isLoading: updating } = useUpdateDmLoaiCotAntenMutation();

  const onSubmit = async (data: FormValuesProps) => {
    if (initData) {
      updateLoaiCotAnten(
        { id: initData.id.toString(), ...data },
        {
          onSuccess: () => {
            enqueueSnackbar(`Cập nhật Loại cột Anten "${data.ten}" thành công`, {
              variant: 'success',
            });
            reset();
            onClose();
          },
          onError: () => {
            enqueueSnackbar(`Có lỗi trong quá trình cập nhật Loại cột Anten`, {
              variant: 'error',
            });
          },
        }
      );
    } else {
      createLoaiCotAnten(
        {
          ...data,
        },
        {
          onSuccess: () => {
            enqueueSnackbar(`Thêm mới Loại cột Anten "${data.ten}" thành công`, {
              variant: 'success',
            });
            reset();
            onClose();
          },
          onError: () => {
            enqueueSnackbar(`Có lỗi trong quá trình thêm mới Loại cột Anten`, {
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
            <RHFTextField name="ma" label="Mã" />
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
