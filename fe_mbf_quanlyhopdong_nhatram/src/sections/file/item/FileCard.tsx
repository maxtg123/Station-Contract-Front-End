import { Box, Button, Card, CardProps, Checkbox, IconButton, MenuItem, Stack } from '@mui/material';
import { useState } from 'react';
import { IFileData } from 'src/@types/file';
import ConfirmDialog from 'src/components/confirm-dialog/ConfirmDialog';
import { fileFormat } from 'src/components/file-thumbnail';
import FileThumbnail from 'src/components/file-thumbnail/FileThumbnail';
import { ExtendFile } from 'src/components/file-thumbnail/types';
import Iconify from 'src/components/iconify/Iconify';
import Label from 'src/components/label/Label';
import MenuPopover from 'src/components/menu-popover/MenuPopover';
import TextMaxLine from 'src/components/text-max-line/TextMaxLine';
import { download, storagePath } from 'src/utils/fileUtils';
import { fData } from 'src/utils/formatNumber';
import { fDateTime } from 'src/utils/formatTime';
import { loaiFileColors } from './FileTableRow';

// ----------------------------------------------------------------------

interface Props extends CardProps {
  file: IFileData;
  selected?: boolean;
  onSelect?: VoidFunction;
  isPhuLuc?: boolean;
  onViewLightBox?: VoidFunction;
}

export default function FileCard({
  file,
  selected,
  onSelect,
  isPhuLuc,
  onViewLightBox,
  sx,
  ...other
}: Props) {
  const [showCheckbox, setShowCheckbox] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);

  const format = fileFormat(file.path);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleShowCheckbox = () => {
    setShowCheckbox(true);
  };

  const handleHideCheckbox = () => {
    setShowCheckbox(false);
  };

  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };
  const handleDownLoadFile = () => {
    download({
      url: `${process.env.NEXT_PUBLIC_STORAGE_ENDPOINT}/${file.path}`,
      fileName: file.file?.name ?? '',
    });
    handleCloseConfirm();
  };

  return (
    <>
      <Card
        onMouseEnter={handleShowCheckbox}
        onMouseLeave={handleHideCheckbox}
        sx={{
          p: 2.5,
          width: 1,
          maxWidth: 222,
          boxShadow: 0,
          bgcolor: 'background.default',
          border: (theme) => `solid 1px ${theme.palette.divider}`,
          ...((showCheckbox || selected) && {
            borderColor: 'transparent',
            bgcolor: 'background.paper',
            boxShadow: (theme) => theme.customShadows.z20,
          }),
          ...sx,
        }}
        {...other}
      >
        {(showCheckbox || selected) && onSelect ? (
          <Checkbox
            checked={selected}
            onClick={onSelect}
            icon={<Iconify icon="eva:radio-button-off-fill" />}
            checkedIcon={<Iconify icon="eva:checkmark-circle-2-fill" />}
          />
        ) : (
          <FileThumbnail
            file={
              format === 'image'
                ? ({ ...file.file, preview: storagePath(file.path) } as ExtendFile)
                : file.file?.type || ''
            }
            imageView={format === 'image'}
            sx={{ width: 40, height: 40 }}
            imgSx={{ width: 40, height: 40, borderRadius: 1 }}
          />
        )}

        <TextMaxLine
          variant="subtitle2"
          persistent
          sx={{ mt: 2, cursor: 'pointer' }}
          onClick={() => {
            onViewLightBox?.();
          }}
        >
          {file.file?.name}
        </TextMaxLine>
        {!isPhuLuc && (
          <Stack spacing={0.75} direction="row" alignItems="center" mb={1}>
            <Label
              variant="soft"
              color={loaiFileColors[file.loai].color}
              sx={{ textTransform: 'capitalize' }}
            >
              {loaiFileColors[file.loai].label}
            </Label>
          </Stack>
        )}

        <Stack
          spacing={0.75}
          direction="row"
          alignItems="center"
          sx={{ typography: 'caption', color: 'text.disabled', mt: 0.5 }}
        >
          <Box> {fData(file.file?.size ?? 0)} </Box>

          <Box sx={{ width: 2, height: 2, borderRadius: '50%', bgcolor: 'currentColor' }} />

          <Box> {fDateTime(file.createdAt)} </Box>
        </Stack>

        <Stack direction="row" alignItems="center" sx={{ top: 8, right: 8, position: 'absolute' }}>
          <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </Stack>
      </Card>

      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        <MenuItem
          onClick={() => {
            handleOpenConfirm();
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:download-outline" />
          Tải xuống
        </MenuItem>
      </MenuPopover>

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Tải xuống"
        content="Bạn có chắc chắn muốn tải xuống file này?"
        action={
          <Button variant="contained" color="error" onClick={handleDownLoadFile}>
            Tải
          </Button>
        }
      />
    </>
  );
}
