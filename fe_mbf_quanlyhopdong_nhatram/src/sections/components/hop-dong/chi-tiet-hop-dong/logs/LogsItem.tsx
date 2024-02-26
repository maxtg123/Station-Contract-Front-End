// @mui
import {
  Box,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import { CustomAvatar } from 'src/components/custom-avatar';
import { fDateTime } from 'src/utils/formatTime';
// @types
// components

// ----------------------------------------------------------------------
type ILogsItem = {
  avatarUrl: string;
  cover: string;
  name: string;
};

type Props = {
  data: ILogsItem;
};

export default function LogsItem({ data }: Props) {
  return (
    <Stack
      sx={{
        py: 1.5,
        px: 2.5,
      }}
      direction="row"
      spacing={1}
      alignItems="center"
    >
      <Box>
        <CustomAvatar alt="" src={data.avatarUrl} sx={{ width: 48, height: 48, marginRight: 0 }} />
      </Box>
      <Stack flexGrow={1}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="subtitle1" noWrap>
            {data.name}
          </Typography>
          <Typography variant="caption" noWrap>
            {data.name}
          </Typography>
        </Stack>

        <Typography noWrap variant="body2" sx={{ color: 'text.secondary', display: 'block' }}>
          {fDateTime(new Date())}
        </Typography>
      </Stack>
    </Stack>
  );
}
