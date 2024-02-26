import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { UpgradeStorageIllustration } from 'src/assets/illustrations';
import ImportErrorIllustration from 'src/assets/illustrations/ImportErrorIllustration';

type Props = {
  title: string;
  isSuccess: boolean;
  messageSuccess?: string;
  messageError?: string;
  onClose: VoidFunction;
};

export default function ImportResult({
  title,
  isSuccess,
  messageSuccess,
  messageError,
  onClose,
}: Props) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        mt: 5,
      }}
    >
      <Typography variant="h4" color={`${isSuccess ? 'primary' : 'default'}`}>
        {title}
      </Typography>
      {isSuccess ? (
        <UpgradeStorageIllustration sx={{ mt: 4, mb: 2 }} />
      ) : (
        <ImportErrorIllustration sx={{ mt: 4, mb: 2 }} />
      )}
      <Typography variant="subtitle1" color="primary" sx={{ my: 1 }}>
        {messageSuccess}
      </Typography>
      {messageError && (
        <Typography variant="subtitle1" color="error" sx={{ my: 1 }}>
          {messageError}
        </Typography>
      )}
      <Button color="primary" variant="contained" onClick={onClose} sx={{ mt: 1, width: '132px' }}>
        Đóng
      </Button>
    </Box>
  );
}
