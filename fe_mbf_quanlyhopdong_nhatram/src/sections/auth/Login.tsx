// @mui
import { Stack, Typography } from '@mui/material';
// auth
// layouts
import LoginLayout from '../../layouts/login';
//
import AuthLoginForm from './AuthLoginForm';

// ----------------------------------------------------------------------

export default function Login() {
  return (
    <LoginLayout>
      <Stack spacing={2} sx={{ mb: 5, position: 'relative' }}>
        <Typography variant="h4">Đăng nhập</Typography>

        <Stack direction="row" spacing={0.5}>
          {/* <Link underline="none" variant="subtitle2">
            Phần mềm quản lý hợp đồng nhà trạm
          </Link> */}
        </Stack>
      </Stack>

      <AuthLoginForm />
    </LoginLayout>
  );
}
