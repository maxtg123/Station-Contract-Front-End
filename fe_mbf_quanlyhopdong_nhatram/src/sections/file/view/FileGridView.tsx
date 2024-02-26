import { useRef } from 'react';
// @mui
import { Box, Button } from '@mui/material';
// @types
//
import { IFileData } from 'src/@types/file';
import { fileFormat } from 'src/components/file-thumbnail';
import Iconify from 'src/components/iconify/Iconify';
import { TableProps } from 'src/components/table';
import { storagePath } from 'src/utils/fileUtils';
import FileCard from '../item/FileCard';
import FileActionSelected from '../portal/FileActionSelected';

// ----------------------------------------------------------------------

type Props = {
  table: TableProps;
  data: IFileData[];
  dataFiltered: IFileData[];
  onOpenConfirm: VoidFunction;
  onViewLightBox?: (imageUrl: string) => void;
};

export default function FileGridView({
  table,
  data,
  dataFiltered,
  onOpenConfirm,
  onViewLightBox,
}: Props) {
  const { selected, onSelectRow: onSelectItem, onSelectAllRows: onSelectAllItems } = table;

  const containerRef = useRef(null);

  return (
    <Box ref={containerRef}>
      <Box
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(4, 1fr)',
        }}
        gap={3}
      >
        {dataFiltered
          .filter((i) => i.file?.type !== 'folder')
          .map((file) => (
            <FileCard
              key={file.id}
              file={file}
              selected={selected.includes(file.id.toString())}
              onSelect={() => onSelectItem(file.id.toString())}
              sx={{ maxWidth: 'auto' }}
              onViewLightBox={() => {
                if (fileFormat(file.path) === 'image' || fileFormat(file.path) === 'pdf') {
                  onViewLightBox?.(storagePath(file.path));
                }
              }}
            />
          ))}
      </Box>

      {!!selected?.length && (
        <FileActionSelected
          numSelected={selected.length}
          rowCount={data.length}
          selected={selected}
          onSelectAllItems={(checked) =>
            onSelectAllItems(
              checked,
              data.map((row) => row.id.toString())
            )
          }
          action={
            <Button
              size="small"
              color="primary"
              variant="contained"
              startIcon={<Iconify icon="eva:download-outline" />}
              onClick={onOpenConfirm}
              sx={{ mr: 1 }}
            >
              Tải xuống
            </Button>
          }
        />
      )}
    </Box>
  );
}
