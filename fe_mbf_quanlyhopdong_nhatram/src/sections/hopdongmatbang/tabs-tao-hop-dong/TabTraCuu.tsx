import { Box, Table, TableBody } from '@mui/material';
import { isNil } from 'lodash';
import dynamic from 'next/dynamic';
import { memo, useCallback, useEffect, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { IOldFilesHopDong } from 'src/@types/hopdong';
import { IHopDongForm } from 'src/@types/hopdongmatbang';
import { fileData, fileFormat } from 'src/components/file-thumbnail';
import { TableNoData } from 'src/components/table';
import { useCreateHopDongContext } from 'src/context/hop-dong-mat-bang/createHopDongContext';
import { storagePath, urlsToFiles } from 'src/utils/fileUtils';
import FileCard from '../components/FileCard';

const PdfDialog = dynamic(() => import('src/components/dialogs/pdf/PdfDialog'), { ssr: false });
const Lightbox = dynamic(() => import('src/components/lightbox/Lightbox'), { ssr: false });

type IFile = IOldFilesHopDong & { file: File };

type Props = {
  oldFiles: IOldFilesHopDong[];
};

const TabTraCuu = ({ oldFiles }: Props) => {
  const { dispatch } = useCreateHopDongContext();

  const { control } = useFormContext<IHopDongForm>();
  const { append: appendFilesDinhKem } = useFieldArray({
    control,
    name: 'filesDinhKem',
  });
  const { append: appendFileGiayToSuHuu } = useFieldArray({
    control,
    name: 'filesGiayToSuHuu',
  });

  const [parsedFiles, setParsedFiles] = useState<IFile[]>([]);
  const [selectedImage, setSelectedImage] = useState<number>(-1);
  const [pdfUrl, setPdfUrl] = useState('');
  const [openPdfDialog, setOpenPdfDialog] = useState(false);

  const parsing = useCallback(async () => {
    const _parsedFiles = await urlsToFiles(oldFiles.map((f) => storagePath(f.path)));
    setParsedFiles(
      oldFiles.map((f, i) => {
        return { ...f, file: _parsedFiles[i] };
      })
    );
  }, [oldFiles]);

  useEffect(() => {
    parsing();
  }, [parsing]);

  const imagesLightbox = oldFiles
    .filter((dt) => dt.path && fileFormat(dt.path) === 'image')
    .map((dt) => ({
      src: storagePath(dt.path || ''),
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

  return parsedFiles.length > 0 ? (
    <>
      <Box
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
        }}
        gap={3}
        pb={2}
      >
        {!isNil(parsedFiles) &&
          parsedFiles &&
          parsedFiles.map((f, i) => {
            const { name = '', size, type = '' } = fileData(f.file);
            return (
              <FileCard
                key={i}
                file={{
                  id: i.toString(),
                  name,
                  size: size || 0,
                  type,
                  url: f.path ? `${process.env.NEXT_PUBLIC_STORAGE_ENDPOINT}/${f.path}` : '',
                  path: f.path || '',
                  dateCreated: '',
                }}
                sx={{ maxWidth: 'auto' }}
                onMoveFileGiayToSuHuu={() => {
                  appendFileGiayToSuHuu({ file: f.file, status: 'new' });
                  dispatch({ type: 'set-active-tab', payload: 'files_giay_to_so_huu' });
                }}
                onMoveFileHopDong={() => {
                  appendFilesDinhKem({ file: f.file, status: 'new' });
                  dispatch({ type: 'set-active-tab', payload: 'files_hop_dong' });
                }}
                onViewLightBox={handleOpenLightbox}
              />
            );
          })}
      </Box>
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
  ) : (
    <Box display="flex" alignItems="center" justifyContent="center" width="100%">
      <Table>
        <TableBody>
          <TableNoData title="Không có dữ liệu tra cứu" isNotFound />
        </TableBody>
      </Table>
    </Box>
  );
};

export default memo(TabTraCuu);
