import { useCallback, useEffect, useState } from 'react';
// next
// @mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Iconify from 'src/components/iconify/Iconify';
import UploadSingleFile from 'src/components/upload/UploadSingleFile';
import { handleDownloadTemplates } from 'src/utils/fileUtils';
// routes

// ----------------------------------------------------------------------
type Props = {
  onChangeFile: (file: File | null) => void;
};
const URL_TEMPLATE_HOP_DONG = `/templates/hop-dong/import-hop-dong.xlsx`;
export default function UploadFileImport({ onChangeFile }: Props) {
  const acceptedFileTypes = {
    accept: {
      'application/vnd.ms-excel': [],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [],
    },
  };
  const [preview] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const handleDropSingleFile = useCallback((acceptedFiles: File[]) => {
    const newFile = acceptedFiles[0];
    if (newFile) {
      setFile(
        Object.assign(newFile, {
          preview: URL.createObjectURL(newFile),
        })
      );
    }
  }, []);
  const handleRemoveFile = (inputFile: File | string) => {
    setFile(null);
  };
  useEffect(() => {
    onChangeFile(file);
  }, [file, onChangeFile]);
  const handleDownloadFile = () => {
    handleDownloadTemplates(URL_TEMPLATE_HOP_DONG, 'Template import thông tin hợp đồng nhà trạm');
  };
  return (
    <Box>
      <Box sx={{ p: 3 }}>
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          sx={{ color: 'primary', cursor: 'pointer' }}
        >
          <Iconify icon="eva:download-fill" color="primary" />
          <Typography
            color="primary"
            sx={{ textDecoration: 'underline', textUnderlinePosition: 'under' }}
            onClick={() => handleDownloadFile()}
          >
            Tải tệp mẫu
          </Typography>
        </Stack>
      </Box>
      <Stack spacing={5}>
        <Card>
          <CardHeader title="Chọn file excel" />
          <CardContent>
            <UploadSingleFile
              thumbnail={preview}
              file={file}
              accept={acceptedFileTypes.accept}
              onDrop={handleDropSingleFile}
              onRemove={handleRemoveFile}
              onUpload={() => console.log('ON UPLOAD')}
            />
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}
