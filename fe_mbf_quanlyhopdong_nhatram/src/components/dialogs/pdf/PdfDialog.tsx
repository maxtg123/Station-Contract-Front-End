import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import Grid from '@mui/material/Grid';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import Iconify from 'src/components/iconify/Iconify';
import { LogoFull } from 'src/components/logo';

interface Props extends Omit<DialogProps, 'title'> {
  title: React.ReactNode;
  open: boolean;
  onClose: VoidFunction;
  url: string;
}
const Transition = React.forwardRef(
  (
    props: TransitionProps & {
      children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>
  ) => <Slide direction="up" ref={ref} {...props} />
);

export default function PdfDialog({ title, open, onClose, url, ...other }: Props) {
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.js',
    import.meta.url
  ).toString();
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState<number | null>(null);
  const handlePrevPage = () => {
    setPageNumber((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setPageNumber((prevPage) => Math.min(prevPage + 1, numPages as number));
  };
  const onDocumentLoadSuccess = ({ numPages: nextNumPages }: PDFDocumentProxy) => {
    setNumPages(nextNumPages);
  };
  return (
    <Dialog
      fullWidth
      fullScreen
      TransitionComponent={Transition}
      keepMounted
      open={open}
      onClose={onClose}
      {...other}
    >
      <Box sx={{ backgroundColor: '#282c34' }}>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ padding: '20px 40px' }}
        >
          <Grid item>
            <LogoFull isScreenImport />
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="inherit"
              onClick={onClose}
              startIcon={<Iconify icon="eva:close-fill" />}
            >
              Đóng
            </Button>
          </Grid>
        </Grid>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            backgroundColor: 'inherit',
          }}
        >
          {' '}
          <Document file={url} onLoadSuccess={onDocumentLoadSuccess}>
            <Page
              pageNumber={pageNumber}
              scale={2.0}
              loading={
                <Box>
                  <CircularProgress size={48} color="primary" />
                </Box>
              }
            />
          </Document>
        </Box>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          gap={2}
          sx={{ padding: '20px', backgroundColor: '#282c34' }}
        >
          <Tooltip title="Trang trước">
            <IconButton
              sx={{
                backgroundColor: 'white',
                '&:hover': {
                  backgroundColor: 'white',
                  color: 'primary.dark',
                },
              }}
              color="primary"
              disabled={pageNumber === 1}
              onClick={handlePrevPage}
            >
              <Iconify icon="ic:baseline-chevron-left" />
            </IconButton>
          </Tooltip>
          <Typography sx={{ color: 'white' }}>
            {pageNumber} of {numPages}
          </Typography>
          <Tooltip title="Trang tiếp theo">
            <IconButton
              sx={{
                backgroundColor: 'white',
                '&:hover': {
                  backgroundColor: 'white',
                  color: 'primary.dark',
                },
              }}
              color="primary"
              disabled={pageNumber === numPages}
              onClick={handleNextPage}
            >
              <Iconify icon="ic:baseline-chevron-right" />
            </IconButton>
          </Tooltip>
        </Grid>
      </Box>
    </Dialog>
  );
}
