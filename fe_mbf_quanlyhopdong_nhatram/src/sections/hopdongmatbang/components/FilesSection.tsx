import { Box, Divider, Stack, Typography } from '@mui/material';
import dynamic from 'next/dynamic';
import { useCallback, useMemo, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { IHopDongForm } from 'src/@types/hopdongmatbang';
import { fileData, fileFormat } from 'src/components/file-thumbnail';
import { Upload } from 'src/components/upload';
import { useCreateHopDongContext } from 'src/context/hop-dong-mat-bang/createHopDongContext';
import { storagePath } from 'src/utils/fileUtils';
import FileCard from './FileCard';

const PdfDialog = dynamic(() => import('src/components/dialogs/pdf/PdfDialog'), { ssr: false });
const Lightbox = dynamic(() => import('src/components/lightbox/Lightbox'), { ssr: false });
type Props = {
  filesName: 'filesDinhKem' | 'filesGiayToSuHuu';
  indexHangMuc?: number;
};
const FilesSection = ({ filesName, indexHangMuc }: Props) => {
  const {
    state: { formType },
  } = useCreateHopDongContext();

  const { control, watch } = useFormContext<IHopDongForm>();
  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: indexHangMuc !== undefined ? `hangMucs.${indexHangMuc}.filesDungChung` : filesName,
  });
  const watchFields = watch(
    indexHangMuc !== undefined ? `hangMucs.${indexHangMuc}.filesDungChung` : filesName
  );

  const [selectedImage, setSelectedImage] = useState<number>(-1);
  const [pdfUrl, setPdfUrl] = useState('');
  const [openPdfDialog, setOpenPdfDialog] = useState(false);

  const imagesLightbox = fields
    .filter((dt) => dt.status === 'old' && dt.path && fileFormat(dt.path) === 'image')
    .map((dt) => ({
      src: storagePath(dt.path || ''),
    }));

  const newUploadFiles = useMemo(() => {
    return watchFields
      .filter((field) => field.status === 'new')
      .map((f) => {
        return Object.assign(f.file, {
          preview: URL.createObjectURL(f.file),
        });
      });
  }, [watchFields]);

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

  const handleDropMultiFile = useCallback(
    (acceptedFiles: File[]) => {
      append(acceptedFiles.map((f) => ({ file: f, status: 'new' })));
    },
    [append]
  );

  const handleRemoveFile = (inputFile: File | string) => {
    const fileIndex = watchFields.findIndex((f) => f.file === inputFile);
    if (fileIndex !== -1) {
      remove(fileIndex);
    }
  };

  const handleRemoveAllNewFiles = () => {
    const currentFiles = [...watchFields];
    currentFiles.forEach((file, index) => {
      if (file.status === 'new') {
        remove(index);
      }
    });
  };

  const handleRemoveAllFiles = () => {
    replace([]);
  };

  return (
    <div>
      <Stack spacing={2} sx={{ mb: 3 }}>
        {formType === 'create' ? (
          <Upload
            multiple
            thumbnail={false}
            files={fields.filter((f) => f.status === 'new').map((f) => f.file)}
            onDrop={handleDropMultiFile}
            onRemove={handleRemoveFile}
            onRemoveAll={handleRemoveAllFiles}
          />
        ) : (
          <>
            {fields.filter((f) => f.status === 'old').length > 0 && (
              <>
                <Typography variant="subtitle2">Files đã uploaded</Typography>
                <Box
                  display="grid"
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(3, 1fr)',
                  }}
                  gap={3}
                >
                  {fields
                    .filter((f) => f.id && f.status === 'old')
                    .map((f) => {
                      const { name = '', size, type = '' } = fileData(f.file);
                      return (
                        <FileCard
                          key={f.id}
                          file={{
                            id: f.id,
                            name,
                            size: size || 0,
                            type,
                            url: f.path
                              ? `${process.env.NEXT_PUBLIC_STORAGE_ENDPOINT}/${f.path}`
                              : '',
                            path: f.path || '',
                            dateCreated: f.createdAt || '',
                          }}
                          sx={{ maxWidth: 'auto' }}
                          onDelete={() => handleRemoveFile(f.file)}
                          onViewLightBox={handleOpenLightbox}
                        />
                      );
                    })}
                </Box>
                <Divider sx={{ borderStyle: 'dashed' }} />
              </>
            )}

            <Typography variant="subtitle2">Upload files mới</Typography>
            <Upload
              multiple
              thumbnail
              files={newUploadFiles}
              onDrop={handleDropMultiFile}
              onRemove={handleRemoveFile}
              onRemoveAll={handleRemoveAllNewFiles}
            />
          </>
        )}
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
    </div>
  );
};

export default FilesSection;
