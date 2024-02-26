import { Button, Dialog, DialogContent, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Iconify from 'src/components/iconify/Iconify';
import Scrollbar from 'src/components/scrollbar/Scrollbar';
import HopDongChiTietModal from 'src/sections/components/hop-dong/chi-tiet-hop-dong/HopDongChiTietModal';

type Props = {
  open: boolean;
  onClose: VoidFunction;
  onClick: VoidFunction;
  title: string;
};

export default function DialogWithRoute({ open, onClose, onClick, title }: Props) {
  const theme = useTheme();
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen
      disableEscapeKeyDown
      sx={{
        zIndex: theme.zIndex.drawer - 1,
        // zIndex: 10,
      }}
    >
      <Scrollbar>
        <DialogContent sx={{ p: 4 }}>
          <Stack mb={2} justifyContent="space-between" alignItems="center" direction="row">
            <Typography variant="h6">{title}</Typography>
            <Button
              variant="outlined"
              color="error"
              onClick={onClick}
              startIcon={<Iconify icon="eva:close-fill" />}
            >
              Đóng
            </Button>
          </Stack>
          <HopDongChiTietModal />
        </DialogContent>
      </Scrollbar>
    </Dialog>
  );
}
