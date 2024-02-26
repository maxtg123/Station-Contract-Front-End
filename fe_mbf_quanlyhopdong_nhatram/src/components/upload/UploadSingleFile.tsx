import { useDropzone } from 'react-dropzone';
// @mui
import { Box, Stack, StackProps, Typography } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
// assets
import { UploadIllustration } from '../../assets/illustrations';
//
//
import RejectionFiles from './errors/RejectionFiles';
import SingleFilePreview from './preview/SingleFilePreview';
import { UploadProps } from './types';

// ----------------------------------------------------------------------

const StyledDropZone = styled('div')(({ theme }) => ({
  outline: 'none',
  cursor: 'pointer',
  overflow: 'hidden',
  position: 'relative',
  padding: theme.spacing(5),
  borderRadius: theme.shape.borderRadius,
  transition: theme.transitions.create('padding'),
  backgroundColor: theme.palette.background.neutral,
  border: `1px dashed ${alpha(theme.palette.grey[500], 0.32)}`,
  '&:hover': {
    opacity: 0.72,
  },
}));

// ----------------------------------------------------------------------

export default function UploadSingleFile({
  disabled,
  error,
  helperText,
  //
  file,
  onDelete,
  //
  files,
  thumbnail,
  onUpload,
  onRemove,
  sx,
  ...other
}: UploadProps) {
  const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
    disabled,
    ...other,
  });

  const hasFile = !!file;

  const isError = isDragReject || !!error;

  return (
    <Box sx={{ width: 1, position: 'relative', ...sx }}>
      <StyledDropZone
        {...getRootProps()}
        sx={{
          ...(isDragActive && {
            opacity: 0.72,
          }),
          ...(isError && {
            color: 'error.main',
            bgcolor: 'error.lighter',
            borderColor: 'error.light',
          }),
          ...(disabled && {
            opacity: 0.48,
            pointerEvents: 'none',
          }),
        }}
      >
        <input {...getInputProps()} />
        <Placeholder />
      </StyledDropZone>

      {helperText && helperText}

      <RejectionFiles fileRejections={fileRejections} />

      {hasFile && <SingleFilePreview file={file} thumbnail={thumbnail} onRemove={onRemove} />}
    </Box>
  );
}

// ----------------------------------------------------------------------

function Placeholder({ sx, ...other }: StackProps) {
  return (
    <Stack
      spacing={5}
      alignItems="center"
      justifyContent="center"
      direction={{
        xs: 'column',
        md: 'row',
      }}
      sx={{
        width: 1,
        textAlign: {
          xs: 'center',
          md: 'left',
        },
        ...sx,
      }}
      {...other}
    >
      <UploadIllustration sx={{ width: 220 }} />

      <div>
        <Typography gutterBottom variant="h5">
          Kéo thả hoặc chọn file
        </Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Kéo thả file hoặc
          <Typography
            variant="body2"
            component="span"
            sx={{
              mx: 0.5,
              color: 'primary.main',
              textDecoration: 'underline',
            }}
          >
            bấm vào đây
          </Typography>
          để chọn file
        </Typography>
      </div>
    </Stack>
  );
}
