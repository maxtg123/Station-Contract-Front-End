import { LinearProgress, Typography } from '@mui/material';

export default function ProgressImport() {
  return (
    <>
      <LinearProgress
        color="primary"
        variant="indeterminate"
        sx={{ mb: 2, width: '700px', height: '30px' }}
      />
      <Typography>Đang trong quá trình import dữ liệu</Typography>
    </>
  );
}
