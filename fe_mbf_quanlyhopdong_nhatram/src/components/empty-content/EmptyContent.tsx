// @mui
import { Button, Stack, StackProps, Typography } from '@mui/material';
//
import Iconify from '../iconify/Iconify';
import Image from '../image';

// ----------------------------------------------------------------------

interface EmptyContentProps extends StackProps {
  title: string;
  img?: string;
  description?: string;
  handleOpenCreate?: VoidFunction;
  handleOpenImport?: VoidFunction;
  haveBtnCreate?: boolean;
  haveBtnImport?: boolean;
}

export default function EmptyContent({
  title,
  description,
  img,
  sx,
  handleOpenCreate,
  handleOpenImport,
  haveBtnCreate = false,
  haveBtnImport = false,
  ...other
}: EmptyContentProps) {
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      sx={{
        height: 1,
        textAlign: 'center',
        p: (theme) => theme.spacing(8, 2),
        ...sx,
      }}
      {...other}
    >
      <Image
        disabledEffect
        alt="empty content"
        src={img || '/assets/illustrations/illustration_empty_content.svg'}
        sx={{ height: 240, mb: 3 }}
      />
      <Stack direction="row" alignItems="center" spacing={2} mb={2}>
        {haveBtnCreate && (
          <Button
            variant="contained"
            onClick={handleOpenCreate}
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            Thêm mới
          </Button>
        )}
        {haveBtnImport && (
          <Button
            variant="contained"
            onClick={handleOpenImport}
            startIcon={<Iconify icon="eva:cloud-upload-fill" />}
          >
            Import
          </Button>
        )}
      </Stack>

      <Typography variant="caption" gutterBottom>
        {title}
      </Typography>

      {description && (
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {description}
        </Typography>
      )}
    </Stack>
  );
}
