import { IconButton, MenuItem, Stack, TableCell, TableRow, Typography } from '@mui/material';
import { useState } from 'react';
import { IFileDataDamPhan } from 'src/@types/damphan';
import { fileFormat } from 'src/components/file-thumbnail';
import FileThumbnail from 'src/components/file-thumbnail/FileThumbnail';
import { ExtendFile } from 'src/components/file-thumbnail/types';
import Iconify from 'src/components/iconify/Iconify';
import MenuPopover from 'src/components/menu-popover/MenuPopover';
import { download, storagePath } from 'src/utils/fileUtils';
import { fData } from 'src/utils/formatNumber';

// ----------------------------------------------------------------------

type Props = {
  row: IFileDataDamPhan;
  no: number;
  onViewLightBox?: VoidFunction;
};

export default function FileTableRow({ row, no, onViewLightBox }: Props) {
  const { file } = row;

  const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);

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
          {fData(file?.size ?? 0)}
        </TableCell>

        <TableCell align="center" sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
          {file?.type}
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
            handleDownLoadFile();
          }}
        >
          <Iconify icon="eva:download-outline" />
          Tải xuống
        </MenuItem>
        <MenuItem
          onClick={() => {
            onViewLightBox?.();
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:eye-fill" />
          Xem chi tiết
        </MenuItem>
      </MenuPopover>
    </>
  );
}
