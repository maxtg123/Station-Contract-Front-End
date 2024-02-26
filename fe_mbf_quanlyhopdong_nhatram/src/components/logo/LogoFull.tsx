import { forwardRef } from 'react';
// next
import NextLink from 'next/link';
// @mui
import { Box, Link, BoxProps } from '@mui/material';

// ----------------------------------------------------------------------

export interface LogoFullProps extends BoxProps {
  isFullLogo?: boolean;
  isScreenImport?: boolean;
  onOpenClose?: VoidFunction;
}

const LogoFull = forwardRef<HTMLDivElement, LogoFullProps>(
  ({ sx, isScreenImport, onOpenClose, ...other }, ref) => {
    // OR using local (public folder)
    // -------------------------------------------------------
    const logoFull = (
      <Box
        component="img"
        src="/logo/logo-mbf.png"
        sx={{ width: 209, height: 35, cursor: 'pointer', ...sx }}
      />
    );
    return (
      <>
        {isScreenImport ? (
          <Box
            component="img"
            src="/logo/logo-mbf.png"
            sx={{ width: 209, height: 35, cursor: 'pointer', ...sx }}
            onClick={onOpenClose}
          />
        ) : (
          <Link component={NextLink} href="/" sx={{ display: 'contents' }}>
            {logoFull}
          </Link>
        )}
      </>
    );
  }
);

export default LogoFull;
