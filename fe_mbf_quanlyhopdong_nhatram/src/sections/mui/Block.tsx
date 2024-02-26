// @mui
import { Box, Paper, Stack, SxProps, Typography } from '@mui/material';
import { Theme, alpha } from '@mui/material/styles';
import Image from 'src/components/image/Image';

// ----------------------------------------------------------------------

type BlockProps = {
  title?: string;
  children: React.ReactNode;
  sx?: SxProps<Theme>;
  icon?: string;
};

export function Block({ title, sx, children, icon }: BlockProps) {
  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: 1.5,
        bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
      }}
    >
      {title && (
        <Stack direction="row" alignItems="center" spacing={2} mt={2} ml={2}>
          <Image alt={icon} src={icon} sx={{ width: 48, height: 48 }} />
          <Typography variant="h6">{title}</Typography>
        </Stack>
      )}
      <Box
        sx={{
          p: 2,
          minHeight: 180,
          ...sx,
        }}
      >
        {children}
      </Box>
    </Paper>
  );
}

// ----------------------------------------------------------------------

type LabelProps = {
  title: string;
};

export function Label({ title }: LabelProps) {
  return (
    <Typography variant="overline" component="p" gutterBottom sx={{ color: 'text.secondary' }}>
      {title}
    </Typography>
  );
}
