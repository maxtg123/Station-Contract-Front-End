import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { ConfirmDialogProps } from './types';

// ----------------------------------------------------------------------

export default function ConfirmDialog({
  title,
  content,
  action,
  open,
  onClose,
  ...other
}: ConfirmDialogProps) {
  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose} {...other}>
      <DialogTitle sx={{ pb: 2 }}>{title}</DialogTitle>

      {content && (
        <DialogContent sx={{ typography: 'body2', whiteSpace: 'pre-line' }}>
          {' '}
          {content}{' '}
        </DialogContent>
      )}

      <DialogActions>
        {action}

        <Button variant="outlined" color="inherit" onClick={onClose}>
          Hủy
        </Button>
      </DialogActions>
    </Dialog>
  );
}
