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
import React from 'react';
import { useForm } from 'react-hook-form';
import { IDmXa } from 'src/@types/category';
import { RHFAutocomplete, RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/FormProvider';
import * as Yup from 'yup';

type OptionType = {
  ma: string;
  ten: string;
};

interface Props extends Omit<DialogProps, 'title'> {
  title: React.ReactNode;
  open: boolean;
  onClose: VoidFunction;
  initData?: IDmXa | null;
  onCreate?: VoidFunction;
}
type FormValuesProps = {
  ten: string;
  ma: string;
  huyen: OptionType;
  ghiChu: string;
  afterSubmit?: string;
};
const optionListHuyenQuan = [
  {
    ma: '1',
    ten: 'Thạnh Phú',
  },
  {
    ma: '2',
    ten: 'Mỏ Cày',
  },
  {
    ma: '3',
    ten: 'Ba Tri',
  },
  {
    ma: '4',
    ten: 'Bình Đại',
  },
];
export default function PhuongXaCreate({
  title,
  open,
  onClose,
  initData,
  onCreate,
  ...other
}: Props) {
  const phuongXaSchema = Yup.object().shape({
    ten: Yup.string().required('Tên là trường bắt buộc'),
    ma: Yup.string().required('Mã là trường bắt buộc'),
    huyen: Yup.object().required('Huyện là trường bắt buộc').nullable(),
  });
  const defaultValues = {
    ten: initData?.ten || '',
    ma: initData?.ma || '',
    huyen: initData?.huyen,
    ghiChu: initData?.ghiChu || '',
  };
  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(phuongXaSchema),
    defaultValues,
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState: { isSubmitting, isSubmitSuccessful },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    try {
      console.log(data);
    } catch (error) {
      console.error(error);
      reset();
      setError('afterSubmit', {
        ...error,
        message: error.message,
      });
    }
  };
  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose} {...other}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle sx={{ pb: 2 }}>{title}</DialogTitle>
        <DialogContent sx={{ typography: 'body2' }}>
          <Stack spacing={3} mt={2}>
            <RHFTextField name="ten" label="Tên (*)" />
            <RHFTextField name="ma" label="Mã (*)" />
            <RHFAutocomplete
              name="huyen"
              label="Chọn huyện"
              options={optionListHuyenQuan}
              getOptionLabel={(option: OptionType | string) => (option as OptionType).ten}
              value={initData?.huyen}
            />
            <RHFTextField name="ghi_chu" label="Ghi chú" multiline minRows={3} maxRows={10} />
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
            loading={isSubmitSuccessful || isSubmitting}
          >
            Lưu
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
