import { Alert, Box } from '@mui/material';
import React from 'react';
import LogsFilter from './logs/LogsFilter';
import LogsList from './logs/LogsList';

type Props = {
  data: any;
};

export default function Logs({ data }: Props) {
  return (
    <Box>
      <Alert severity="warning">
        Logs này ghi lại các hành động lên việc thay đổi dữ liệu của trạm. Cứ sau 30 ngày, dữ liệu
        logs sẽ được xoá và ghi mới lại
      </Alert>
      <LogsFilter />
      <LogsList />
    </Box>
  );
}
