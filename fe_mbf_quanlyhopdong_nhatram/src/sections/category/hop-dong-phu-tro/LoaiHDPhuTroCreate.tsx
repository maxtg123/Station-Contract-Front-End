import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  InputAdornment,
  Stack,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useForm } from 'react-hook-form';
import { NumericFormat, NumericFormatProps } from 'react-number-format';
import { IDmLoaiHDPhuTro } from 'src/@types/category';
import { RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/FormProvider';
import RHFTextFieldHasZero from 'src/components/hook-form/RHFTextFieldHasZero';
import {
  useCreateDmLoaiHDPhuTroMutation,
  useUpdateDmLoaiHDPhuTroMutation,
} from 'src/data/dmLoaiHDPhuTro';
import * as Yup from 'yup';

const LoaiHDPhuTroSchema = Yup.object().shape({
  ma: Yup.string(),
  ten: Yup.string().required('Tên thuê phụ trợ là trường bắt buộc'),
  gia: Yup.number().typeError('Hãy nhập giá tiền!').min(0, 'Số tiền không được phép nhỏ hơn 0!'),
});

interface Props extends Omit<DialogProps, 'title'> {
  title: React.ReactNode;
  open: boolean;
  onClose: VoidFunction;
  initData?: IDmLoaiHDPhuTro | null;
  onCreate?: VoidFunction;
}
type FormValuesProps = {
  ma: string;
  ten: string;
  ghiChu: string;
  maDataSite: string;
  gia: number;
  afterSubmit?: string;
};

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}
const NumericFormatCustom = React.forwardRef<NumericFormatProps, CustomProps>((props, ref) => {
  const { onChange, ...other } = props;
  return (
    <NumericFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator
      valueIsNumericString
    />
  );
});

export default function LoaiHDPhuTroCreate({
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
    ghiChu: initData?.ghiChu || '',
    gia: initData?.gia || 0,
  };
  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(LoaiHDPhuTroSchema),
    defaultValues,
  });

  const { reset, handleSubmit } = methods;

  const { enqueueSnackbar } = useSnackbar();

  const { mutate: createLoaiHDPhuTro, isLoading: creating } = useCreateDmLoaiHDPhuTroMutation();
  const { mutate: updateLoaiHDPhuTro, isLoading: updating } = useUpdateDmLoaiHDPhuTroMutation();

  const onSubmit = async (data: FormValuesProps) => {
    if (initData) {
      updateLoaiHDPhuTro(
        { id: initData.id.toString(), ...data },
        {
          onSuccess: () => {
            enqueueSnackbar(`Cập nhật thuê phụ trợ "${data.ten}" thành công`, {
              variant: 'success',
            });
            reset();
            onClose();
          },
          onError: () => {
            enqueueSnackbar(`Có lỗi trong quá trình cập nhật thuê phụ trợ`, {
              variant: 'error',
            });
          },
        }
      );
    } else {
      createLoaiHDPhuTro(
        {
          ...data,
        },
        {
          onSuccess: () => {
            enqueueSnackbar(`Thêm mới thuê phụ trợ "${data.ten}" thành công`, {
              variant: 'success',
            });
            reset();
            onClose();
          },
          onError: () => {
            enqueueSnackbar(`Có lỗi trong quá trình thêm mới thuê phụ trợ`, {
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
            <RHFTextFieldHasZero
              name="gia"
              label="Giá tiền (*)"
              InputProps={{
                inputComponent: NumericFormatCustom as any,
                endAdornment: <InputAdornment position="end">VNĐ</InputAdornment>,
              }}
            />
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
