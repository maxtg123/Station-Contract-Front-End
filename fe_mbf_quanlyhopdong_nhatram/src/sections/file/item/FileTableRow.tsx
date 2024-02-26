import { useState } from 'react';
// @mui
import {
  Button,
  Checkbox,
  IconButton,
  MenuItem,
  Stack,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
import { IFileData } from 'src/@types/file';
import ConfirmDialog from 'src/components/confirm-dialog/ConfirmDialog';
import { fileFormat } from 'src/components/file-thumbnail';
import FileThumbnail from 'src/components/file-thumbnail/FileThumbnail';
import { ExtendFile } from 'src/components/file-thumbnail/types';
import Iconify from 'src/components/iconify/Iconify';
import Label from 'src/components/label/Label';
import MenuPopover from 'src/components/menu-popover/MenuPopover';
import { download, storagePath } from 'src/utils/fileUtils';
import { fData } from 'src/utils/formatNumber';
import { fDate } from 'src/utils/formatTime';

// ----------------------------------------------------------------------

type Props = {
  row: IFileData;
  selected: boolean;
  onSelectRow: VoidFunction;
  onViewLightBox?: VoidFunction;
  no: number;
};

type ValidLabelColor = 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';

export const loaiFileColors: Record<string, { label: string; color: ValidLabelColor }> = {
  FILE_HOP_DONG: { label: 'Hợp đồng', color: 'primary' },
  FILE_GIAY_TO_SO_HUU: { label: 'Giấy tờ sở hữu', color: 'secondary' },
  FILE_PHU_LUC: { label: 'Phụ Lục', color: 'warning' },
  FILE_DUNG_CHUNG: { label: 'Dùng chung', color: 'info' },
  // Các loại và màu sắc khác
};

export default function FileTableRow({ row, selected, onSelectRow, onViewLightBox, no }: Props) {
  const { file, createdAt, loai } = row;
  const [openConfirm, setOpenConfirm] = useState(false);

  const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };
  const handleDownLoadFile = () => {
    download({
      url: `${process.env.NEXT_PUBLIC_STORAGE_ENDPOINT}/${row.path}`,
      fileName: row.file?.name ?? '',
    });
    handleCloseConfirm();
  };

  const format = fileFormat(row.path);

  return (
    <>
      <TableRow
        sx={{
          borderRadius: 1,
          '& .MuiTableCell-root': {
            bgcolor: 'white',
          },
        }}
      >
        <TableCell
          padding="checkbox"
          sx={{
            borderTopLeftRadius: 8,
            borderBottomLeftRadius: 8,
            width: '10px',
          }}
        >
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell
          onClick={() => {
            onViewLightBox?.();
          }}
          sx={{ cursor: 'pointer' }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            {file && (
              <FileThumbnail
                file={
                  format === 'image'
                    ? ({ ...file, preview: storagePath(row.path) } as ExtendFile)
                    : file?.type || ''
                }
                imageView={format === 'image'}
                imgSx={{ width: 32, height: 32, borderRadius: 1 }}
              />
            )}

            <Typography noWrap variant="inherit" sx={{ maxWidth: 360 }}>
              {file?.name}
            </Typography>
          </Stack>
        </TableCell>
        <TableCell align="left" sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
          <Label
            variant="soft"
            color={loaiFileColors[loai].color}
            sx={{ textTransform: 'capitalize' }}
          >
            {loaiFileColors[loai].label}
          </Label>
        </TableCell>
        <TableCell align="left" sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
          {fData(file?.size ?? 0)}
        </TableCell>

        <TableCell align="center" sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
          {file?.type}
        </TableCell>

        <TableCell align="left" sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
          {fDate(createdAt)}
        </TableCell>
        <TableCell
          align="right"
          sx={{
            whiteSpace: 'nowrap',
            borderTopRightRadius: 8,
            borderBottomRightRadius: 8,
          }}
        >
          <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        <MenuItem
          onClick={() => {
            handleClosePopover();
            handleOpenConfirm();
          }}
        >
          <Iconify icon="eva:download-outline" />
          Tải xuống
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClosePopover();
            onViewLightBox?.();
          }}
        >
          <Iconify icon="eva:eye-fill" />
          Xem chi tiết
        </MenuItem>
      </MenuPopover>
      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Tải xuống"
        content="Bạn có chắn chắn muốn tải xuống file này?"
        action={
          <Button variant="contained" color="error" onClick={handleDownLoadFile}>
            Tải
          </Button>
        }
      />
    </>
  );
}
