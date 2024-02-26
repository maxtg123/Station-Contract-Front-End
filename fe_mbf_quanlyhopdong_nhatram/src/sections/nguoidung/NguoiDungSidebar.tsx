import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import {
  Divider,
  Drawer,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { INguoiDungForm, INguoiDungInput } from 'src/@types/nguoidung';
import { RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/FormProvider';
import Iconify from 'src/components/iconify/Iconify';
import Scrollbar from 'src/components/scrollbar/Scrollbar';
import { useCreateNguoiDungMutation, useUpdateNguoiDungMutation } from 'src/data/nguoidung';
import * as Yup from 'yup';
import KhuVucField from './form/fields/KhuVucField';

const Schema = Yup.object().shape({
  email: Yup.string().email('Địa chỉ email không hợp lệ').required('Email là trường bắt buộc'),
  hoTen: Yup.string().required('Họ và tên là trường bắt buộc'),
  gioiTinh: Yup.string().oneOf(['NAM', 'NU']).required('Giới tính là trường bắt buộc'),
  soDienThoai: Yup.string().required('Số điện thoại là trường bắt buộc'),
  khuVucList: Yup.array().of(
    Yup.object().shape({
      dmTo: Yup.object()
        .shape({
          id: Yup.number(),
        })
        .nullable(),
      dmPhongDai: Yup.object()
        .shape({ id: Yup.number().required('Phòng/Đài là trường bắt buộc') })
        .typeError('Phòng/Đài là trường bắt buộc'),
      chucVu: Yup.object()
        .shape({
          id: Yup.number().required().typeError('Chức vụ là trường bắt buộc'),
        })
        .typeError('Chức vụ là trường bắt buộc'),
      loai: Yup.mixed().oneOf(['CHINH', 'KHU_VUC']),
    })
  ),
});

const defaultUser: INguoiDungForm = {
  hoTen: '',
  gioiTinh: 'NAM',
  soDienThoai: '',
  email: '',
  khuVucList: [{ loai: 'CHINH', dmPhongDai: null, dmTo: null, chucVu: null }],
  trangThai: 'HOAT_DONG',
};

export interface NguoiDungSidebarProps {
  open: boolean;
  onClose: (value: boolean) => void;
  initData: INguoiDungForm | null;
}

export default function NguoiDungSidebar(props: NguoiDungSidebarProps) {
  const { onClose, open, initData } = props;

  const { enqueueSnackbar } = useSnackbar();

  const methods = useForm<INguoiDungForm>({
    resolver: yupResolver(Schema),
    defaultValues: initData || defaultUser,
  });
  const { handleSubmit, setValue, reset, watch } = methods;
  const wGioiTinh = watch('gioiTinh');

  const { mutate: createNguoiDung, isLoading: creating } = useCreateNguoiDungMutation();
  const { mutate: updateNguoiDung, isLoading: updating } = useUpdateNguoiDungMutation();

  const handleClose = () => {
    onClose(false);
  };

  const onSubmit = async (data: INguoiDungForm) => {
    const input: INguoiDungInput = {
      email: data.email,
      hoTen: data.hoTen,
      gioiTinh: data.gioiTinh,
      soDienThoai: data.soDienThoai,
      nguoiDungKhuVucList: data.khuVucList.map((kv) => ({
        phongDaiId: kv.dmPhongDai?.id || 0,
        toId: kv.dmTo?.id || null,
        phongDaiChucVuId: kv.chucVu?.id || 0,
        loai: kv.loai,
      })),
      trangThai: initData ? initData.trangThai : 'HOAT_DONG',
    };
    if (initData && initData.id) {
      updateNguoiDung(
        { id: initData.id.toString(), ...input },
        {
          onSuccess: () => {
            enqueueSnackbar(`Cập nhật người dùng "${input.email}" thành công`, {
              variant: 'success',
            });
            reset();
            handleClose();
          },
          onError: (error: any) => {
            const errorMsg = 'Có lỗi trong quá trình cập nhật người dùng';
            enqueueSnackbar(errorMsg, {
              variant: 'error',
            });
          },
        }
      );
    } else {
      createNguoiDung(input, {
        onSuccess: () => {
          enqueueSnackbar(`Thêm mới người dùng "${input.email}" thành công`, {
            variant: 'success',
          });
          reset();
          handleClose();
        },
        onError: (error: any) => {
          const errorMsg = 'Có lỗi trong quá trình thêm mới người dùng';
          enqueueSnackbar(errorMsg, {
            variant: 'error',
          });
        },
      });
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      // onClick={setterFormUpdate}
      onClose={handleClose}
      BackdropProps={{
        invisible: true,
      }}
      PaperProps={{
        sx: { width: 360 },
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ pl: 2, pr: 1, py: 2 }}
      >
        <Typography variant="subtitle1">
          {!initData ? 'Thêm mới người dùng' : 'Chỉnh sửa người dùng'}
        </Typography>
        <div>
          <IconButton onClick={handleClose}>
            <Iconify icon="eva:close-fill" />
          </IconButton>
        </div>
      </Stack>

      <Divider />
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Scrollbar>
          <Stack spacing={3} sx={{ p: 2.5 }}>
            <RHFTextField
              name="email"
              label="Email (*)"
              helperText="Email người dùng phải tồn tại trong LDAP"
            />
            <RHFTextField name="hoTen" label="Tên đầy đủ (*)" />

            <FormControl fullWidth>
              <FormLabel id="demo-row-radio-buttons-group-label">
                <h4 style={{ margin: 0 }}>Giới tính</h4>
              </FormLabel>
              <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="gioiTinh">
                <FormControlLabel
                  checked={wGioiTinh === 'NAM'}
                  onChange={() => {
                    setValue('gioiTinh', 'NAM');
                  }}
                  value="NAM"
                  control={<Radio />}
                  label="Nam"
                />
                <FormControlLabel
                  checked={wGioiTinh === 'NU'}
                  onChange={() => {
                    setValue('gioiTinh', 'NU');
                  }}
                  value="NU"
                  control={<Radio />}
                  label="Nữ"
                />
              </RadioGroup>
            </FormControl>

            <RHFTextField name="soDienThoai" label="Số điện thoại (*)" />

            <KhuVucField />
          </Stack>

          <div style={{ margin: '0px 20px 0', textAlign: 'right' }}>
            <LoadingButton
              variant="contained"
              type="submit"
              color="primary"
              loading={creating || updating}
            >
              {initData ? 'Cập nhật' : 'Tạo'}
            </LoadingButton>
          </div>
        </Scrollbar>
      </FormProvider>
    </Drawer>
  );
}
