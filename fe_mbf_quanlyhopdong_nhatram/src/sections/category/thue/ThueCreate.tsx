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
import { IDmThue } from 'src/@types/category';
import { RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/FormProvider';
import RHFTextFieldHasZero from 'src/components/hook-form/RHFTextFieldHasZero';
import { useCreateDmThueMutation, useUpdateDmThueMutation } from 'src/data/dmThue';
import * as Yup from 'yup';

const ThueSchema = Yup.object().shape({
  soThue: Yup.number()
    .typeError('Mức thuế là trường bắt buộc')
    .min(0, 'Mức thuế không được phép nhỏ hơn 0!'),
  ghiChu: Yup.string(),
});

interface Props extends Omit<DialogProps, 'title'> {
  title: React.ReactNode;
  open: boolean;
  onClose: VoidFunction;
  initData?: IDmThue | null;
  onCreate?: VoidFunction;
}
type FormValuesProps = {
  soThue: number;
  ghiChu: string;
  afterSubmit?: string;
};
export default function ThueCreate({ title, open, onClose, initData, onCreate, ...other }: Props) {
  const defaultValues = {
    soThue: initData?.soThue || 0,
    ghiChu: initData?.ghiChu || '',
  };
  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(ThueSchema),
    defaultValues,
  });

  const { reset, handleSubmit } = methods;

  const { enqueueSnackbar } = useSnackbar();

  const { mutate: createThue, isLoading: creating } = useCreateDmThueMutation();
  const { mutate: updateThue, isLoading: updating } = useUpdateDmThueMutation();

  const onSubmit = async (data: FormValuesProps) => {
    if (initData) {
      updateThue(
        { id: initData.id.toString(), ...data },
        {
          onSuccess: () => {
            enqueueSnackbar(`Cập nhật mức thuế "${data.soThue}%" thành công`, {
              variant: 'success',
            });
            reset();
            onClose();
          },
          onError: () => {
            enqueueSnackbar(`Có lỗi trong quá trình cập nhật mức thuế`, {
              variant: 'error',
            });
          },
        }
      );
    } else {
      createThue(
        {
          ...data,
        },
        {
          onSuccess: () => {
            enqueueSnackbar(`Thêm mới mức thuế "${data.soThue}%" thành công`, {
              variant: 'success',
            });
            reset();
            onClose();
          },
          onError: () => {
            enqueueSnackbar(`Có lỗi trong quá trình thêm mới thuế`, {
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
            <RHFTextFieldHasZero type="number" name="soThue" label="Mức % thuế (*)" />
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
