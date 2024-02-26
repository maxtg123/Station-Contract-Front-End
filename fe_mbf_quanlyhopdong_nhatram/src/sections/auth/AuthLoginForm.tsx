import { useState } from 'react';
import * as Yup from 'yup';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
import { Alert, IconButton, InputAdornment, Stack } from '@mui/material';
// auth
import { useLogin } from 'src/data/user';
// components
import { useRouter } from 'next/router';
import { PATH_DASHBOARD } from 'src/routes/paths';
import { setAuthCredentials } from 'src/utils/authUtils';
import FormProvider, { RHFCheckbox, RHFTextField } from '../../components/hook-form';
import Iconify from '../../components/iconify';

// ----------------------------------------------------------------------

type FormValuesProps = {
  email: string;
  password: string;
  afterSubmit?: string;
};

export default function AuthLoginForm() {
  const { push } = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .required('Mobi Email là trường bắt buộc')
      .email('Mobi Email phải là một địa chỉ email hợp lệ'),
    password: Yup.string().required('Mật khẩu là trường bắt buộc'),
  });

  // const defaultValues = {
  //   email: 'superadmin@mobifone.vn',
  //   password: 'HopdongNT@3214$',
  // };
  const defaultValues = {
    email: '',
    password: '',
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const { mutate: login, error } = useLogin();

  const onSubmit = async (values: FormValuesProps) => {
    login(
      { username: values.email, password: values.password },
      {
        onSuccess(data) {
          setAuthCredentials(data?.token, data.profile);
          push(PATH_DASHBOARD.root);
        },
        onError: () => {},
      }
    );
  };
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {error ? <Alert severity="error">Vui lòng kiểm tra thông tin tài khoản LDAP</Alert> : <></>}

        <RHFTextField name="email" label="Mobi Email (*)" />

        <RHFTextField
          name="password"
          label="Mật khẩu (*)"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>
      <br />

      <RHFCheckbox name="loginRemember" label="Ghi nhớ đăng nhập" />
      <br />

      <LoadingButton
        fullWidth
        color="primary"
        size="large"
        type="submit"
        variant="contained"
        loadingIndicator="đang đăng nhập..."
        loading={isSubmitting}
      >
        Đăng nhập
      </LoadingButton>
    </FormProvider>
  );
}
