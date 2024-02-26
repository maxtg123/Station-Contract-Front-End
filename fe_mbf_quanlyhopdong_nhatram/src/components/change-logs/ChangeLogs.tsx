import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
  timelineItemClasses,
} from '@mui/lab';
import { IResultDiff } from 'src/utils/logUtils';
import LogSentence from './log-sentence/LogSentence';

type Props = {
  logs: IResultDiff[];
};
const ChangeLogs = ({ logs = [] }: Props) => {
  if (logs.length === 0) return null;
  return (
    <Timeline
      sx={{
        p: 0,
        [`& .${timelineItemClasses.root}:before`]: {
          flex: 0,
          padding: 0,
        },
      }}
    >
      {logs.map((log, i) => {
        const isLast = i === logs.length - 1;
        return (
          <TimelineItem key={i} sx={{ minHeight: '50px' }}>
            <TimelineSeparator>
              <TimelineDot variant="outlined" />
              {isLast ? null : <TimelineConnector />}
            </TimelineSeparator>

            <TimelineContent>
              <LogSentence log={log} />
            </TimelineContent>
          </TimelineItem>
        );
      })}
    </Timeline>
  );
};

export default ChangeLogs;
