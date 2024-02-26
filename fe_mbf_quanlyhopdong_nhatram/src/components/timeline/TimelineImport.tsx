// next
// @mui
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
  timelineItemClasses,
} from '@mui/lab';
import { Block } from 'src/sections/mui/Block';
// routes

// ----------------------------------------------------------------------

type IColorTimeLine =
  | 'error'
  | 'success'
  | 'inherit'
  | 'grey'
  | 'primary'
  | 'secondary'
  | 'info'
  | 'warning';

type TimelineType = {
  key: number;
  title: string;
  color: IColorTimeLine;
};

const TIMELINES: TimelineType[] = [
  {
    key: 1,
    title: 'Tải tệp mẫu để nhập nhanh và chính xác hơn',
    color: 'primary',
  },
  {
    key: 2,
    title:
      'Nếu dữ liệu chưa có trong hệ thống thì sẽ được tạo mới, nếu dữ liệu trong hệ thống đã tồn tại thì sẽ được ghi đè (cập nhật).',
    color: 'primary',
  },
  {
    key: 3,
    title: 'Các hợp đồng chưa hiện hữu mới được import để thêm mới hoặc cập nhật',
    color: 'warning',
  },
];
const DIR_ICON = '/assets/icons/faqs/ic_assurances.svg';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------
export default function TimelineImport() {
  const lastItem = TIMELINES[TIMELINES.length - 1].key;
  return (
    <Block title="Gợi ý" icon={DIR_ICON}>
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
            <TimelineContent>{item.title}</TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </Block>
  );
}
