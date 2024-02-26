import { Box, Link, Stack, Typography } from '@mui/material';
import NextLink from 'next/link';
import { IHopDong } from 'src/@types/hopdongmatbang';

type Props = {
  data: IHopDong;
};
const ThongTinDocTac = ({ data }: Props) => (
  <Box>
    <Typography
      variant="subtitle2"
      gutterBottom
      sx={{ color: '#1963AE', fontWeight: '700', mb: '16px' }}
    >
      THÔNG TIN ĐỐI TÁC
    </Typography>
    <Typography variant="body2" gutterBottom>
      <Typography component="span" variant="body2" sx={{ fontWeight: '700' }}>
        Tên đối tác:
      </Typography>{' '}
      {data.hopDongDoiTac.ten}
    </Typography>
    <Typography variant="body2" gutterBottom>
      <Typography component="span" variant="body2" sx={{ fontWeight: '700' }}>
        Số điện thoại:
      </Typography>{' '}
      {data.hopDongDoiTac.soDienThoai}
    </Typography>
    <Stack direction="row" alignItems="center" mb={1}>
      <Typography component="span" variant="body2" sx={{ fontWeight: '700' }}>
        Liên hệ:
      </Typography>{' '}
      {data.hopDongDoiTac.soDienThoai && (
        <Link
          component={NextLink}
          href={`https://zalo.me/${data.hopDongDoiTac.soDienThoai}`}
          sx={{ width: 36, height: 36 }}
          target="_blank"
        >
          <Box component="img" src="/assets/icons/social/zalo/zalo-48.svg" />
        </Link>
      )}
    </Stack>
    <Typography variant="body2" gutterBottom>
      <Typography component="span" variant="body2" sx={{ fontWeight: '700' }}>
        Số CMND/CCCD:
      </Typography>{' '}
      {data.hopDongDoiTac.cccd}
    </Typography>
    <Typography variant="body2" gutterBottom>
      <Typography component="span" variant="body2" sx={{ fontWeight: '700' }}>
        Mã số thuế:
      </Typography>{' '}
      {data.hopDongDoiTac.maSoThue}
    </Typography>
    <Typography variant="body2" gutterBottom>
      <Typography component="span" variant="body2" sx={{ fontWeight: '700' }}>
        Địa chỉ liên hệ:
      </Typography>{' '}
      {data.hopDongDoiTac.diaChi}
    </Typography>
  </Box>
);

export default ThongTinDocTac;
