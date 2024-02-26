// @mui
import { Stack, Typography } from '@mui/material';
// components
import Image from '../../components/image';
//
import { StyledContent, StyledRoot, StyledSection, StyledSectionBg } from './styles';

// ----------------------------------------------------------------------

type Props = {
  title?: string;
  illustration?: string;
  children: React.ReactNode;
};

export default function LoginLayout({ children, illustration, title }: Props) {
  return (
    <StyledRoot>
      <StyledSection>
        <Typography variant="h3" sx={{ mb: 10, maxWidth: 480, textAlign: 'center' }}>
          {title || (
            <Image
              disabledEffect
              visibleByDefault
              alt="auth"
              src={illustration || '/assets/illustrations/Logo-Mobifone.png'}
              sx={{ maxWidth: 320 }}
            />
          )}
        </Typography>

        <Image
          disabledEffect
          visibleByDefault
          alt="auth"
          src={illustration || '/assets/illustrations/illustration_dashboard.png'}
          sx={{ maxWidth: 720 }}
        />

        <StyledSectionBg />
      </StyledSection>

      <StyledContent>
        <Stack sx={{ width: 1 }}> {children} </Stack>
      </StyledContent>
    </StyledRoot>
  );
}
