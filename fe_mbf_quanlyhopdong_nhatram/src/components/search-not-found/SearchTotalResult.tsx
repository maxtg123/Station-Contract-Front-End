import { Stack, Typography } from '@mui/material';
import React from 'react';

type Props = {
  total: number;
};

export default function SearchTotalResult({ total }: Props) {
  return (
    <Stack direction="row" spacing={1} mb={1} alignItems="center">
      <Typography variant="body1">Có</Typography>
      <Typography variant="h6">{total}</Typography>
      <Typography variant="body1">kết quả tìm kiếm được</Typography>
    </Stack>
  );
}
