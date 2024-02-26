import { Stack, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import React, { useState } from 'react';
import { IHopDong } from 'src/@types/hopdongmatbang';
import { IListTramByHopDong } from 'src/@types/thanhtoan';
import ConfirmDialog from 'src/components/confirm-dialog/ConfirmDialog';
import Iconify from 'src/components/iconify/Iconify';
import { LogoFull } from 'src/components/logo';
import TienHanhThanhToan from './TienHanhThanhToan';

interface Props extends Omit<DialogProps, 'title'> {
  title: string;
  subtitle: string;
  open: boolean;
  onClose: VoidFunction;
  isEdit?: boolean;
  onCreate?: VoidFunction;
  data: IHopDong[];
  onResetSelectedAllRows: VoidFunction;
  selectedTramByContract: IListTramByHopDong[];
}
const Transition = React.forwardRef(
  (
    props: TransitionProps & {
      children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>
  ) => <Slide direction="up" ref={ref} {...props} />
);

export default function TienHanhThanhToanDialog({
  title,
  subtitle,
  open,
  onClose,
  isEdit,
  onCreate,
  data,
  onResetSelectedAllRows,
  selectedTramByContract,
  ...other
}: Props) {
  const [openConfirm, setOpenConfirm] = useState(false);
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
  return (
    <>
      <Dialog
        fullWidth
        fullScreen
        TransitionComponent={Transition}
        keepMounted
        open={open}
        onClose={onClose}
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
            <Button
              variant="outlined"
              color="inherit"
              onClick={() => handleOpenConfirm()}
              startIcon={<Iconify icon="eva:close-fill" />}
            >
              Đóng
            </Button>
          </Grid>
        </Grid>
        <DialogTitle sx={{ p: 0, pb: 1, textAlign: 'center' }}>
          <Stack direction="column" spacing={1}>
            <Typography variant="h3">{title}</Typography>
            <Typography variant="body1">{subtitle}</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ typography: 'body2', padding: '0 40px' }}>
          <TienHanhThanhToan
            selectedTramByContract={selectedTramByContract}
            data={data}
            onCloseConfirm={handleCloseConfirm}
            onResetSelectedAllRows={onResetSelectedAllRows}
          />
        </DialogContent>
      </Dialog>
      {openConfirm && (
        <ConfirmDialog
          open={openConfirm}
          onClose={handleCancelConfirm}
          title="Thoát !"
          content={<>Bạn có muốn thoát khỏi tính năng thanh toán hợp đồng?</>}
          action={
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                handleCloseConfirm();
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
