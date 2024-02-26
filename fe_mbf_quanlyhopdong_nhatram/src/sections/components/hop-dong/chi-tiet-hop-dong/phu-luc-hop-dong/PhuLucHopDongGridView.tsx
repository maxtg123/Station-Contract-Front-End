import { Box, Button, Collapse, Divider } from '@mui/material';
import { useRef, useState } from 'react';
import { IDataHopDongPhuLuc } from 'src/@types/hopdongmatbang';
import Iconify from 'src/components/iconify/Iconify';
import { TableProps } from 'src/components/table';
import { FileActionSelected, FileCard } from 'src/sections/file';
import PhuLucHopDongPanel from './PhuLucHopDongPanel';

type Props = {
  table: TableProps;
  data: IDataHopDongPhuLuc[];
  onOpenConfirm: VoidFunction;
};

export default function PhuLucHopDongGridView({ data, table, onOpenConfirm }: Props) {
  const containerRef = useRef(null);
  const { selected, onSelectRow: onSelectItem, onSelectAllRows: onSelectAllItems } = table;
  const [collapseFiles, setCollapseFiles] = useState<string[]>([]);

  const handleToggleCollapse = (itemId: string) => {
    setCollapseFiles((prevItems) => {
      if (prevItems.includes(itemId)) {
        return prevItems.filter((item) => item !== itemId);
      }
      return [...prevItems, itemId];
    });
  };
  return (
    <>
      {data.length > 0 &&
        data.map((item) => (
          <Box ref={containerRef} key={item.phuLuc.id.toString()}>
            <PhuLucHopDongPanel
              thongTinPhuLuc={item.phuLuc}
              onCollapse={() => handleToggleCollapse(item.phuLuc.id.toString())}
              collapse={!collapseFiles.includes(item.phuLuc.id.toString())}
            />

            <Collapse in={!collapseFiles.includes(item.phuLuc.id.toString())} unmountOnExit>
              <Box
                gap={3}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                  lg: 'repeat(4, 1fr)',
                }}
              >
                {item.file.map((fl) => (
                  <FileCard
                    key={fl.id}
                    file={fl}
                    selected={selected.includes(fl.id.toString())}
                    onSelect={() => onSelectItem(fl.id.toString())}
                    sx={{ maxWidth: 'auto' }}
                    isPhuLuc
                  />
                ))}
              </Box>
            </Collapse>

            <Divider sx={{ my: 5, borderStyle: 'dashed' }} />
          </Box>
        ))}
      {!!selected?.length && (
        <FileActionSelected
          numSelected={selected.length}
          rowCount={data.reduce((count, item) => count + item.file.length, 0)}
          selected={selected}
          onSelectAllItems={(checked) => {
            const selectedIds = data.flatMap((item) => item.file.map((file) => file.id.toString()));
            onSelectAllItems(checked, selectedIds);
          }}
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
    </>
  );
}
