import { Box, Button, List, Stack } from '@mui/material';
import React from 'react';
import { _userCards } from 'src/_mock/arrays';
import LogsItem from './LogsItem';

type Props = {
  data?: any;
};

export default function LogsList({ data }: Props) {
  return (
    <Box>
      {_userCards.slice(0, 5).map((item, index) => (
        <LogsItem key={index} data={item} />
      ))}
      <Stack direction="row" alignItems="center" justifyContent="center">
        <Button color="primary" sx={{ flexShrink: 0 }} variant="outlined">
          Tải thêm
        </Button>
      </Stack>
    </Box>
  );
}
