import { Box, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { fPercent } from 'src/utils/formatNumber';
import Iconify from '../iconify/Iconify';

type Props = {
  percent: number;
  text: string;
};
const TrendingInfo = ({ percent, text = '' }: Props) => {
  return (
    <Stack direction="row" alignItems="center" sx={{ mt: 2, mb: 1 }}>
      <Iconify
        icon={percent < 0 ? 'eva:trending-down-fill' : 'eva:trending-up-fill'}
        sx={{
          mr: 1,
          p: 0.5,
          width: 24,
          height: 24,
          borderRadius: '50%',
          color: 'success.main',
          bgcolor: (theme) => alpha(theme.palette.success.main, 0.16),
          ...(percent < 0 && {
            color: 'error.main',
            bgcolor: (theme) => alpha(theme.palette.error.main, 0.16),
          }),
        }}
      />

      <Typography variant="subtitle2" component="div" noWrap>
        {percent > 0 && '+'}

        {fPercent(percent)}

        <Box component="span" sx={{ color: 'text.secondary', typography: 'body2' }}>
          {text}
        </Box>
      </Typography>
    </Stack>
  );
};

export default TrendingInfo;
