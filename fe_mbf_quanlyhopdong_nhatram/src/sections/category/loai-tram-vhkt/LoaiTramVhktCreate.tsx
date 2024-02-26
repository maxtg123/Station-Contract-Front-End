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
import { IDmLoaiTramVhkt } from 'src/@types/category';
import { RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/FormProvider';
import {
  useCreateDmLoaiTramVhktMutation,
  useUpdateDmLoaiTramVhktMutation,
} from 'src/data/dmLoaiTramVhkt';
import * as Yup from 'yup';

const LoaiTramVhktSchema = Yup.object().shape({
  ten: Yup.string().required('Tên là trường bắt buộc'),
  ma: Yup.string(),
  ghiChu: Yup.string(),
});

interface Props extends Omit<DialogProps, 'title'> {
  title: React.ReactNode;
  open: boolean;
  onClose: VoidFunction;
  initData?: IDmLoaiTramVhkt | null;
  onCreate?: VoidFunction;
}
type FormValuesProps = {
  ten: string;
  ma: string;
  ghiChu: string;
  afterSubmit?: string;
};
export default function LoaiTramVhktCreate({
  title,
  open,
  onClose,
  initData,
  onCreate,
  ...other
}: Props) {
  const defaultValues = {
    ten: initData?.ten || '',
    ma: initData?.ma || '',
    ghiChu: initData?.ghiChu || '',
  };
  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(LoaiTramVhktSchema),
    defaultValues,
  });

  const { reset, handleSubmit } = methods;

  const { enqueueSnackbar } = useSnackbar();

  const { mutate: createLoaiTramVhkt, isLoading: creating } = useCreateDmLoaiTramVhktMutation();
  const { mutate: updateLoaiTramVhkt, isLoading: updating } = useUpdateDmLoaiTramVhktMutation();

  const onSubmit = async (data: FormValuesProps) => {
    if (initData) {
      updateLoaiTramVhkt(
        { id: initData.id.toString(), ...data },
        {
          onSuccess: () => {
            enqueueSnackbar(`Cập nhật Loại trạm VHKT "${data.ten}" thành công`, {
              variant: 'success',
            });
            reset();
            onClose();
          },
          onError: () => {
            enqueueSnackbar(`Có lỗi trong quá trình cập nhật Loại trạm VHKT`, {
              variant: 'error',
            });
          },
        }
      );
    } else {
      createLoaiTramVhkt(
        {
          ...data,
        },
        {
          onSuccess: () => {
            enqueueSnackbar(`Thêm mới Loại trạm vhkt "${data.ten}" thành công`, {
              variant: 'success',
            });
            reset();
            onClose();
          },
          onError: () => {
            enqueueSnackbar(`Có lỗi trong quá trình thêm mới Loại trạm vhkt`, {
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
