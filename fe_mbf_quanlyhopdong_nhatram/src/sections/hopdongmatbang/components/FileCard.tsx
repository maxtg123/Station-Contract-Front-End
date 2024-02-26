import { Box, Button, Card, CardProps, Divider, IconButton, MenuItem, Stack } from '@mui/material';
import { useState } from 'react';
import ConfirmDialog from 'src/components/confirm-dialog/ConfirmDialog';
import { fileFormat } from 'src/components/file-thumbnail';
import FileThumbnail from 'src/components/file-thumbnail/FileThumbnail';
import { ExtendFile } from 'src/components/file-thumbnail/types';
import Iconify from 'src/components/iconify/Iconify';
import MenuPopover from 'src/components/menu-popover/MenuPopover';
import TextMaxLine from 'src/components/text-max-line/TextMaxLine';
import { download, storagePath } from 'src/utils/fileUtils';
import { fData } from 'src/utils/formatNumber';
import { fDateTime } from 'src/utils/formatTime';

// ----------------------------------------------------------------------

type IFile = {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  path: string;
  dateCreated: Date | number | string;
};

interface Props extends CardProps {
  file: IFile;
  onDelete?: VoidFunction;
  onViewLightBox?: (imageUrl: string) => void;
  onMoveFileHopDong?: VoidFunction;
  onMoveFileGiayToSuHuu?: VoidFunction;
}

export default function FileCard({
  file,
  onDelete,
  onViewLightBox,
  onMoveFileHopDong,
  onMoveFileGiayToSuHuu,
  sx,
  ...other
}: Props) {
  const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);
  const [openConfirm, setOpenConfirm] = useState(false);

  const format = fileFormat(file.path);
  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const handleDownload = () => {
    download({
      url: file.url,
      fileName: file.name,
    });
  };

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleDelete = () => {
    onDelete?.();
  };

  return (
    <>
      <Card
        sx={{
          p: 2.5,
          width: 1,
          maxWidth: 222,
          boxShadow: 0,
          bgcolor: 'background.default',
          border: (theme) => `solid 1px ${theme.palette.divider}`,
          cursor: 'pointer',
          ...sx,
        }}
        onClick={() => {
          if (format === 'image' || format === 'pdf') {
            onViewLightBox?.(storagePath(file.path));
          }
        }}
        {...other}
      >
        <FileThumbnail
          file={
            format === 'image'
              ? ({ path: file.path, preview: storagePath(file.path) } as ExtendFile)
              : file.type
          }
          sx={{ width: 40, height: 40 }}
          imageView={format === 'image'}
          imgSx={{ width: 40, height: 40, borderRadius: 1 }}
        />

        <TextMaxLine variant="subtitle2" persistent sx={{ mt: 2, mb: 0.5 }}>
          {file.name}
        </TextMaxLine>

        <Stack
          spacing={0.75}
          direction="row"
          alignItems="center"
          sx={{ typography: 'caption', color: 'text.disabled', mt: 0.5 }}
        >
          <Box> {fData(file.size)} </Box>

          <Box sx={{ width: 2, height: 2, borderRadius: '50%', bgcolor: 'currentColor' }} />

          <Box> {fDateTime(file.dateCreated)} </Box>
        </Stack>

        <Stack direction="row" alignItems="center" sx={{ top: 8, right: 8, position: 'absolute' }}>
          <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </Stack>
      </Card>

      <MenuPopover open={openPopover} onClose={handleClosePopover} arrow="right-top">
        <MenuItem
          onClick={() => {
            handleClosePopover();
            handleDownload();
          }}
        >
          <Iconify icon="eva:download-outline" />
          Tải xuống
        </MenuItem>

        {onDelete && (
          <>
            <Divider sx={{ borderStyle: 'dashed' }} />
            <MenuItem
              onClick={() => {
                handleOpenConfirm();
                handleClosePopover();
              }}
              sx={{ color: 'error.main' }}
            >
              <Iconify icon="eva:trash-2-outline" />
              Xóa
            </MenuItem>
          </>
        )}
        {onMoveFileHopDong && (
          <>
            <Divider sx={{ borderStyle: 'dashed' }} />
            <MenuItem
              onClick={() => {
                onMoveFileHopDong();
                handleClosePopover();
              }}
            >
              <Iconify icon="eva:copy-outline" />
              Clone sang file hợp đồng
            </MenuItem>
          </>
        )}
        {onMoveFileGiayToSuHuu && (
          <>
            <Divider sx={{ borderStyle: 'dashed' }} />
            <MenuItem
              onClick={() => {
                onMoveFileGiayToSuHuu();
                handleClosePopover();
              }}
            >
              <Iconify icon="eva:copy-outline" />
              Clone sang file giấy tờ sở hữu
            </MenuItem>
          </>
        )}
      </MenuPopover>

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Xóa"
        content="Bạn có chắn chắn muốn xóa?"
        action={
          <Button variant="contained" color="error" onClick={handleDelete}>
            Xóa
          </Button>
        }
      />
    </>
  );
}
