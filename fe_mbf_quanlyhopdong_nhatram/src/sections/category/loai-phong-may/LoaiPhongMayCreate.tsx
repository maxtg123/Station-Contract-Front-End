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
import { IDmLoaiPhongMay } from 'src/@types/category';
import { RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/FormProvider';
import {
  useCreateDmLoaiPhongMayMutation,
  useUpdateDmLoaiPhongMayMutation,
} from 'src/data/dmLoaiPhongMay';
import * as Yup from 'yup';

const LoaiPhongMaySchema = Yup.object().shape({
  ma: Yup.string(),
  ten: Yup.string().required('Tên loại phòng máy là trường bắt buộc'),
  maDataSite: Yup.string(),
  ghiChu: Yup.string(),
});

interface Props extends Omit<DialogProps, 'title'> {
  title: React.ReactNode;
  open: boolean;
  onClose: VoidFunction;
  initData?: IDmLoaiPhongMay | null;
  onCreate?: VoidFunction;
}
type FormValuesProps = {
  ma: string;
  ten: string;
  maDataSite: string;
  ghiChu: string;
  afterSubmit?: string;
};
export default function LoaiPhongMayCreate({
  title,
  open,
  onClose,
  initData,
  onCreate,
  ...other
}: Props) {
  const defaultValues = {
    ma: initData?.ma || '',
    ten: initData?.ten || '',
    maDataSite: initData?.maDataSite || '',
    ghiChu: initData?.ghiChu || '',
  };
  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(LoaiPhongMaySchema),
    defaultValues,
  });

  const { reset, handleSubmit } = methods;

  const { enqueueSnackbar } = useSnackbar();

  const { mutate: createLoaiPhongMay, isLoading: creating } = useCreateDmLoaiPhongMayMutation();
  const { mutate: updateLoaiPhongMay, isLoading: updating } = useUpdateDmLoaiPhongMayMutation();

  const onSubmit = async (data: FormValuesProps) => {
    if (initData) {
      updateLoaiPhongMay(
        { id: initData.id.toString(), ...data },
        {
          onSuccess: () => {
            enqueueSnackbar(`Cập nhật loại phòng máy "${data.ten}" thành công`, {
              variant: 'success',
            });
            reset();
            onClose();
          },
          onError: () => {
            enqueueSnackbar(`Có lỗi trong quá trình cập nhật loại phòng máy`, {
              variant: 'error',
            });
          },
        }
      );
    } else {
      createLoaiPhongMay(
        {
          ...data,
        },
        {
          onSuccess: () => {
            enqueueSnackbar(`Thêm mới loại phòng máy "${data.ten}" thành công`, {
              variant: 'success',
            });
            reset();
            onClose();
          },
          onError: () => {
            enqueueSnackbar(`Có lỗi trong quá trình thêm mới Loại phòng máy`, {
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
            <RHFTextField name="ten" label="Tên loại phòng máy" />
            <RHFTextField name="ma" label="Mã" />
            <RHFTextField name="ghiChu" label="Ghi chú" multiline minRows={3} maxRows={10} />
            <RHFTextField name="maDataSite" label="Mã DataSite" />
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
