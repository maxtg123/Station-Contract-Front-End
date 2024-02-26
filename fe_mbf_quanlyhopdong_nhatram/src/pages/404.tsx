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
import { PageNotFoundIllustration } from '../assets/illustrations';

// ----------------------------------------------------------------------

Page404.getLayout = (page: React.ReactElement) => <CompactLayout>{page}</CompactLayout>;

// ----------------------------------------------------------------------

export default function Page404() {
  return (
    <>
      <Head>
        <title> 404 Page Not Found</title>
      </Head>

      <MotionContainer>
        <m.div variants={varBounce().in}>
          <Typography variant="h3" paragraph>
            Xin lỗi, trang này không tìm thấy!
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <Typography sx={{ color: 'text.secondary' }}>
            Xin lỗi, chúng tôi không thể tìm thấy trang mà bạn đang tìm kiếm. Có thể bạn nhập sai
            địa chỉ URL? Hãy kiểm tra lại địa chỉ URL.
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <PageNotFoundIllustration
            sx={{
              height: 260,
              my: { xs: 5, sm: 10 },
            }}
          />
        </m.div>

        <Button component={NextLink} href="/" size="large" variant="contained">
          Về trang chủ
        </Button>
      </MotionContainer>
    </>
  );
}
