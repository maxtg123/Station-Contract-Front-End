import { Box, BoxProps, Link, Typography } from '@mui/material';

type Props = BoxProps;

const Footer = ({ ...boxProps }: Props) => {
  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        px: 4,
        textAlign: 'left',
        position: 'relative',
        bgcolor: 'background.default',
      }}
      {...boxProps}
    >
      <Box>
        <Typography variant="caption" component="div">
          {new Date().getFullYear()} ©{' '}
          <Link target="_blank" href="https://www.mobifone.vn/">
            mobifone
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
