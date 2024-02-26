import {
  Box,
  Button,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { memo, useCallback, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { IHopDongForm } from 'src/@types/hopdongmatbang';
import { DialogAnimate } from 'src/components/animate';
import Iconify from 'src/components/iconify/Iconify';
import { LogoFull } from 'src/components/logo';
import { Upload } from 'src/components/upload';
import { useCreateHopDongContext } from 'src/context/hop-dong-mat-bang/createHopDongContext';
import DanhSachPhuLuc from 'src/sections/components/hop-dong/chi-tiet-hop-dong/DanhSachPhuLuc';
import GhiChuPhuLucField from '../fields/GhiChuPhuLucField';

const TabFilesPhuLuc = () => {
  const {
    state: { formType },
  } = useCreateHopDongContext();

  const { control, getValues } = useFormContext<IHopDongForm>();
  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: 'filesPhuLuc',
  });

  const [open, setOpen] = useState(false);

  const handleDropMultiFile = useCallback(
    (acceptedFiles: File[]) => {
      append(acceptedFiles.map((f) => ({ file: f, status: 'new' })));
    },
    [append]
  );

  const handleRemoveFile = (inputFile: File | string) => {
    const fileIndex = fields.findIndex((f) => f.file === inputFile);
    if (fileIndex !== -1) {
      remove(fileIndex);
    }
  };

  const handleRemoveAllFiles = () => {
    replace([]);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (formType === 'create') {
    return <Box />;
  }
  return (
    <>
      <Stack spacing={2} sx={{ mb: 3 }}>
        {getValues('hopDongPhuLucModels').length > 0 && (
          <>
            <Stack display="flex" direction="row">
              <Button variant="outlined" onClick={handleOpen}>
                Xem chi tiết các phụ lục đã uploaded
              </Button>
            </Stack>
            <Divider sx={{ borderStyle: 'dashed' }} />
          </>
        )}

        <Typography variant="subtitle2">Upload files phụ lục mới</Typography>
        <Upload
          multiple
          thumbnail={false}
          files={fields.filter((f) => f.status === 'new').map((f) => f.file)}
          onDrop={handleDropMultiFile}
          onRemove={handleRemoveFile}
          onRemoveAll={handleRemoveAllFiles}
        />
        <GhiChuPhuLucField />
      </Stack>

      <DialogAnimate open={open} onClose={handleClose} fullWidth fullScreen>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ padding: '20px 40px' }}
        >
          <Grid item>
            <LogoFull isScreenImport onOpenClose={handleClose} />
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              color="inherit"
              onClick={handleClose}
              startIcon={<Iconify icon="eva:close-fill" />}
            >
              Đóng
            </Button>
          </Grid>
        </Grid>
        <DialogTitle variant="h3" sx={{ p: 0, pb: 1, textAlign: 'center', fontWeight: 700 }}>
          Danh sách phụ lục đã được uploaded
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          <DanhSachPhuLuc
            dataFile={getValues('remoteFiles').filter((f) => f.loai === 'FILE_PHU_LUC') || []}
            dataPhuLuc={getValues('hopDongPhuLucModels') || []}
            soHopDong={getValues('soHopDong')}
          />
        </DialogContent>
      </DialogAnimate>
    </>
  );
};

export default memo(TabFilesPhuLuc);
