import { Typography } from '@mui/material';

export default function ComingSoon() {
  return (
    <div style={{ position: 'absolute', top: '50%', left: '50%' }}>
      <Typography variant="h3" paragraph style={{ textAlign: 'center' }}>
        Sắp sửa được ra mắt!
      </Typography>

      <Typography sx={{ color: 'text.secondary', textAlign: 'center' }}>
        Tính năng đang trong giai đoạn phát triển!
      </Typography>
    </div>
  );
}
