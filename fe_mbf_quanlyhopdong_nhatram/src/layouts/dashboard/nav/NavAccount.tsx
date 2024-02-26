// @mui
import { Box, Link, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
// auth
// components
import useAuthCredentials from 'src/hooks/useAuthCredentials';
import { CustomAvatar } from '../../../components/custom-avatar';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  background: theme.palette.primary.main,
  // background: 'linear-gradient(90deg,rgba(254,38,38,0.5943627450980392) 0%, rgba(0,97,186,1) 100%)',
  transition: theme.transitions.create('opacity', {
    duration: theme.transitions.duration.shorter,
  }),
}));

// ----------------------------------------------------------------------

export default function NavAccount() {
  const { profile } = useAuthCredentials();
  return (
    <Link underline="none" color="inherit">
      <StyledRoot>
        <CustomAvatar name={profile?.email} />
        <Box sx={{ ml: 2, minWidth: 0 }}>
          <Typography variant="subtitle1" noWrap sx={{ color: 'white' }}>
            {profile?.hoTen}
          </Typography>

          <Typography variant="body2" noWrap sx={{ color: '#f0f0f0' }}>
            {profile?.email}
          </Typography>
        </Box>
      </StyledRoot>
    </Link>
  );
}
