import { m } from 'framer-motion';
// next
import Head from 'next/head';
import NextLink from 'next/link';
// @mui
import { Button, Typography } from '@mui/material';
// layouts
import CompactLayout from '../layouts/compact';
// components
import { MotionContainer, varBounce } from '../components/animate';
// assets
import { ForbiddenIllustration } from '../assets/illustrations';

// ----------------------------------------------------------------------

Page403.getLayout = (page: React.ReactElement) => <CompactLayout>{page}</CompactLayout>;

// ----------------------------------------------------------------------

export default function Page403() {
  return (
    <>
      <Head>
        <title> 403 Forbidden | Hợp đồng trạm</title>
      </Head>

      <MotionContainer>
        <m.div variants={varBounce().in}>
          <Typography variant="h3" paragraph>
            Không có quyền
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <Typography sx={{ color: 'text.secondary' }}>
            Trang mà bạn đang truy cập hạn chế quyền của bạn
            <br />
            Vui lòng liên hệ người quản trị hệ thống
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <ForbiddenIllustration sx={{ height: 260, my: { xs: 5, sm: 10 } }} />
        </m.div>

        <Button component={NextLink} href="/" size="large" variant="contained">
          Về trang chủ
        </Button>
      </MotionContainer>
    </>
  );
}
