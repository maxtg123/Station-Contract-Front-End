import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  MenuItem,
  Stack,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useForm } from 'react-hook-form';
import { IDmDoiTuongKyHopDong, ILoaiDoiTuong } from 'src/@types/category';
import { RHFSelect, RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/FormProvider';
import {
  useCreateDmDoiTuongKyHopDongMutation,
  useUpdateDmDoiTuongKyHopDongMutation,
} from 'src/data/dmDoiTuongKyHopDong';
import * as Yup from 'yup';

interface Props extends Omit<DialogProps, 'title'> {
  title: React.ReactNode;
  open: boolean;
  onClose: VoidFunction;
  initData?: IDmDoiTuongKyHopDong | null;
  onCreate?: VoidFunction;
}
type FormValuesProps = {
  ten: string;
  ma: string;
  ghiChu: string;
  loaiDoiTuong: ILoaiDoiTuong;
  afterSubmit?: string;
};

const loaiDoiTuongArr = [
  { id: 'PHAP_NHAN', ten: 'Pháp nhân' },
  { id: 'CA_NHAN', ten: 'Cá nhân' },
  { id: 'KHAC', ten: 'Khác' },
];

export default function DoiTuongKyHopDongCreate({
  title,
  open,
  onClose,
  onCreate,
  initData,
  ...other
}: Props) {
  const doiTuongKyHopDongSchema = Yup.object().shape({
    ten: Yup.string().required('Tên là trường bắt buộc'),
    ma: Yup.string(),
    loaiDoiTuong: Yup.string().required('Loại đối tượng là trường bắt buộc'),
  });
  const defaultValues = {
    ten: initData?.ten || '',
    ma: initData?.ma || '',
    loaiDoiTuong: initData?.loaiDoiTuong || 'KHAC',
    ghiChu: initData?.ghiChu || '',
  };
  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(doiTuongKyHopDongSchema),
    defaultValues,
  });
  const { enqueueSnackbar } = useSnackbar();

  const { mutate: createDoiTuongKyHopDong, isLoading: creating } =
    useCreateDmDoiTuongKyHopDongMutation();
  const { mutate: updateDoiTuongKyHopDong, isLoading: updating } =
    useUpdateDmDoiTuongKyHopDongMutation();

  const { reset, handleSubmit } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    if (initData) {
      updateDoiTuongKyHopDong(
        { id: initData.id.toString(), ...data },
        {
          onSuccess: () => {
            enqueueSnackbar(`Cập nhật Đối tượng ký hợp đồng "${data.ten}" thành công`, {
              variant: 'success',
            });
            reset();
            onClose();
          },
          onError: () => {
            enqueueSnackbar(`Có lỗi trong quá trình cập nhật Đối tượng ký hợp đồng`, {
              variant: 'error',
            });
          },
        }
      );
    } else {
      createDoiTuongKyHopDong(
        {
          ...data,
        },
        {
          onSuccess: () => {
            enqueueSnackbar(`Thêm mới Đối tượng ký hợp đồng "${data.ten}" thành công`, {
              variant: 'success',
            });
            reset();
            onClose();
          },
          onError: () => {
            enqueueSnackbar(`Có lỗi trong quá trình thêm mới Đối tượng ký hợp đồng`, {
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
            <RHFSelect name="loaiDoiTuong" label="Loại đối tượng (*)">
              {loaiDoiTuongArr.map((row, key) => (
                <MenuItem key={key} value={row.id}>
                  {row.ten}
                </MenuItem>
              ))}
            </RHFSelect>
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
