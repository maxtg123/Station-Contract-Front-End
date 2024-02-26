import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import Iconify from 'src/components/iconify/Iconify';
import { LogoFull } from 'src/components/logo';
import { useTienTrinhContext } from 'src/context/tien-trinh/TienTrinhContext';
import LinearAlternativeImport from './import/LinearAlternativeImport';

const ConfirmDialog = dynamic(() => import('src/components/confirm-dialog/ConfirmDialog'), {
  ssr: false,
});
interface Props extends Omit<DialogProps, 'title'> {
  title: React.ReactNode;
  open: boolean;
  onClose: VoidFunction;
  isEdit?: boolean;
  onCreate?: VoidFunction;
}
const Transition = React.forwardRef(
  (
    props: TransitionProps & {
      children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>
  ) => <Slide direction="up" ref={ref} {...props} />
);

export default function HopDongImport({ title, open, onClose, isEdit, onCreate, ...other }: Props) {
  const [openConfirm, setOpenConfirm] = useState(false);
  const [step, setTep] = useState(0);
  const { dispatch } = useTienTrinhContext();
  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };
  const handleCancelConfirm = () => {
    setOpenConfirm(false);
  };
  const handleCloseConfirm = () => {
    onClose();
    setOpenConfirm(false);
  };
  const handleStepFinal = (value: number) => {
    setTep(value);
  };
  const handleCloseDialog = () => {
    handleOpenConfirm();
  };
  return (
    <>
      <Dialog
        fullWidth
        fullScreen
        TransitionComponent={Transition}
        keepMounted
        open={open}
        onClose={handleCloseDialog}
        {...other}
      >
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ padding: '20px 40px' }}
        >
          <Grid item>
            <LogoFull isScreenImport onOpenClose={() => handleOpenConfirm()} />
          </Grid>
          <Grid item>
            {step !== 2 && (
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => handleOpenConfirm()}
                startIcon={<Iconify icon="eva:close-fill" />}
              >
                Đóng
              </Button>
            )}
          </Grid>
        </Grid>
        <DialogTitle variant="h3" sx={{ p: 0, pb: 1, textAlign: 'center', fontWeight: 700 }}>
          {title}
        </DialogTitle>
        <DialogContent sx={{ typography: 'body2', padding: '0 40px' }}>
          <LinearAlternativeImport onClose={onClose} onStepFinal={handleStepFinal} />
        </DialogContent>
        <DialogActions>
          {step === 2 && (
            <Button
              variant="outlined"
              color="inherit"
              onClick={() => handleOpenConfirm()}
              startIcon={<Iconify icon="eva:close-fill" />}
            >
              Đóng
            </Button>
          )}
        </DialogActions>
      </Dialog>
      {openConfirm && (
        <ConfirmDialog
          open={openConfirm}
          onClose={handleCancelConfirm}
          title="Thoát !"
          content={<>Bạn có muốn thoát khỏi tính năng import hợp đồng mặt bằng?</>}
          action={
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                handleCloseConfirm();
                dispatch({ type: 'reset-tien-trinh' });
              }}
            >
              Vẫn thoát
            </Button>
          }
        />
      )}
    </>
  );
}
