import { memo } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Box, BoxProps } from '@mui/material';
//
import BackgroundIllustration from './BackgroundIllustration';

// ----------------------------------------------------------------------

function ImportErrorIllustration({ ...other }: BoxProps) {
  return (
    <Box {...other}>
      <svg width="100%" height="100%" viewBox="0 0 480 360" xmlns="http://www.w3.org/2000/svg">
        <BackgroundIllustration />

        <image
          href="/assets/illustrations/characters/character_6.png"
          height="300"
          x="205"
          y="30"
        />

        <path
          fill="#FFAB00"
          d="M111.1 141.2c58.7-1 58.6-88.3 0-89.2-58.6 1-58.6 88.3 0 89.2z"
          opacity="0.12"
        />

        <path fill="#FFD666" d="M111.1 120c30.8-.5 30.8-46.3 0-46.8-30.8.5-30.8 46.3 0 46.8z" />
      </svg>
    </Box>
  );
}

export default memo(ImportErrorIllustration);
