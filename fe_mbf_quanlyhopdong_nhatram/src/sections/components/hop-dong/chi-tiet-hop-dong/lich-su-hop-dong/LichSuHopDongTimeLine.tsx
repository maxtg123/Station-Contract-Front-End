import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
  timelineItemClasses,
} from '@mui/lab';
import { Box, Typography, Stack, Button } from '@mui/material';
import React from 'react';

type Props = {
  data?: any;
};
type TimelineType = {
  key: number;
  title: string;
  des: string;
  color?: 'primary' | 'info' | 'success' | 'warning' | 'error' | 'inherit' | 'grey' | 'secondary';
};

const TIMELINES: TimelineType[] = [
  {
    key: 1,
    title: 'Hợp đồng được chuyển sang tái ký mới sang mã hợp đồng mới INV1704-00068 ',
    des: '19 tháng 01, 2022 lúc 10:00:00',
    color: 'primary',
  },
  {
    key: 2,
    title: 'Hợp đồng được gia hạn',
    des: '11 tháng 04 năm 2022, lúc 12:00:00',
    color: 'secondary',
  },
  {
    key: 3,
    title: 'Hợp đồng được cập nhật đã thanh toán',
    des: '11 tháng 03 năm 2022, lúc 11:00:00',
    color: 'error',
  },
];
export default function LichSuHopDongTimeLine({ data }: Props) {
  const lastItem = TIMELINES[TIMELINES.length - 1].key;
  return (
    <Box sx={{ pt: 2 }}>
      <Timeline
        sx={{
          [`& .${timelineItemClasses.root}:before`]: {
            flex: 0,
            padding: 0,
          },
        }}
      >
        {TIMELINES.map((item) => (
          <TimelineItem key={item.key}>
            <TimelineSeparator>
              <TimelineDot color={item.color} />
              {lastItem === item.key ? null : <TimelineConnector />}
            </TimelineSeparator>
            <TimelineContent>
              <Typography variant="subtitle2">{item.title}</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {item.des}
              </Typography>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
      <Stack direction="row" alignItems="center" justifyContent="center">
        <Button color="primary" sx={{ flexShrink: 0 }} variant="outlined">
          Tải thêm
        </Button>
      </Stack>
    </Box>
  );
}
