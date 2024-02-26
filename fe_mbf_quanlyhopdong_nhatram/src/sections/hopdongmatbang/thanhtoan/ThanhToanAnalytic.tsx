import { Box, CircularProgress, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import Iconify from 'src/components/iconify/Iconify';

// ----------------------------------------------------------------------

type Props = {
  icon: string;
  title: string;
  subTitle?: string;
  total: number;
  percent?: number;
  color?: string;
};

export default function ThanhToanAnalytic({
  title,
  subTitle = '',
  total,
  icon,
  color,
  percent,
}: Props) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="center"
      sx={{ width: 1, minWidth: 200 }}
    >
      <Stack alignItems="center" justifyContent="center" sx={{ position: 'relative' }}>
        <Iconify icon={icon} width={24} sx={{ color, position: 'absolute' }} />

        <CircularProgress
          variant="determinate"
          value={percent || 100}
          size={56}
          thickness={4}
          sx={{ color, opacity: 0.48 }}
        />

        <CircularProgress
          variant="determinate"
          value={100}
          size={56}
          thickness={4}
          sx={{
            top: 0,
            left: 0,
            opacity: 0.48,
            position: 'absolute',
            color: (theme) => alpha(theme.palette.grey[500], 0.16),
          }}
        />
      </Stack>

      <Stack spacing={0.5} sx={{ ml: 2 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="h6">{title}</Typography>
          {subTitle && (
            <Tooltip
              title={<div style={{ whiteSpace: 'pre-line' }}>{subTitle}</div>}
              placement="right"
            >
              <IconButton color="default">
                <Iconify icon="eva:alert-circle-fill" />
              </IconButton>
            </Tooltip>
          )}
        </Stack>

        <Typography variant="subtitle2">
          {total}{' '}
          <Box component="span" sx={{ color: 'text.secondary', typography: 'body2' }}>
            hợp đồng
          </Box>
        </Typography>
        {/* 
        <Typography variant="subtitle2" sx={{ color }}>
          {percent}%
        </Typography> */}
      </Stack>
    </Stack>
  );
}
