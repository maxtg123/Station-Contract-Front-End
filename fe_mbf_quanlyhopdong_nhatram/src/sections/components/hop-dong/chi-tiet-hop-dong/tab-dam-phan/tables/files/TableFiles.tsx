import { Box, Stack, Table, TableBody, TableContainer, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { IDamPhanFile, IFileDataDamPhan } from 'src/@types/damphan';
import PdfDialog from 'src/components/dialogs/pdf/PdfDialog';
import { fileFormat } from 'src/components/file-thumbnail';
import Lightbox from 'src/components/lightbox/Lightbox';
import { TableHeadCustom } from 'src/components/table';
import { storagePath, urlsToFiles } from 'src/utils/fileUtils';
import FileTableRow from './FileTableRow';

const TABLE_HEAD = [
  { id: 'file.name', label: 'Tên file', align: 'left' },
  { id: 'file.size', label: 'Size', align: 'left', width: 120 },
  { id: 'file.type', label: 'Định dạng', align: 'center', width: 120 },
];

type Props = {
  data: IDamPhanFile[];
};

const TableFiles = ({ data }: Props) => {
  const [tableData, setTableData] = useState<IFileDataDamPhan[]>([]);
  const [selectedImage, setSelectedImage] = useState<number>(-1);
  const [pdfUrl, setPdfUrl] = useState('');
  const [openPdfDialog, setOpenPdfDialog] = useState(false);
  const parseFilesCB = useCallback(async () => {
    const parseFiles = await urlsToFiles(data.map((dt) => storagePath(dt.path)));
    setTableData(data.map((dt, index) => ({ ...dt, file: parseFiles[index] })));
  }, [data]);

  useEffect(() => {
    parseFilesCB();
  }, [parseFilesCB]);
  const imagesLightbox = data
    .filter((dt) => dt.path && fileFormat(dt.path) === 'image')
    .map((dt) => ({
      src: storagePath(dt.path),
    }));

  const handleOpenLightbox = (imageUrl: string) => {
    if (fileFormat(imageUrl) === 'pdf') {
      setPdfUrl(imageUrl);
      setOpenPdfDialog(true);
    } else {
      const imageIndex = imagesLightbox.findIndex((image) => image.src === imageUrl);
      setSelectedImage(imageIndex);
    }
  };

  const handleCloseLightbox = () => {
    setSelectedImage(-1);
  };
  return (
    <>
      <Stack spacing={2}>
        <Typography variant="overline" color="text.disabled" pl={3}>
          Files đính kèm
        </Typography>
        <Box sx={{ px: 1, position: 'relative', borderRadius: 1.5, bgcolor: 'background.neutral' }}>
          <TableContainer>
            <Table
              sx={{
                borderCollapse: 'separate',
                '& .MuiTableCell-head': {
                  boxShadow: 'none !important',
                },
              }}
            >
              <TableHeadCustom
                headLabel={TABLE_HEAD}
                isNumIndex
                sx={{
                  '& .MuiTableCell-head': {
                    bgcolor: 'transparent',
                  },
                }}
              />

              <TableBody>
                {tableData.map((row, index) => (
                  <FileTableRow
                    key={row.id}
                    row={row}
                    no={index}
                    onViewLightBox={() => {
                      if (fileFormat(row.path) === 'image' || fileFormat(row.path) === 'pdf') {
                        handleOpenLightbox?.(storagePath(row.path));
                      }
                    }}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Stack>
      {pdfUrl !== '' ? (
        <PdfDialog
          open={openPdfDialog}
          onClose={() => {
            setOpenPdfDialog(false);
            setPdfUrl('');
          }}
          url={pdfUrl}
          title="File pdf"
        />
      ) : (
        <Lightbox
          index={selectedImage}
          slides={imagesLightbox}
          open={selectedImage >= 0}
          close={handleCloseLightbox}
        />
      )}
    </>
  );
};

export default TableFiles;
