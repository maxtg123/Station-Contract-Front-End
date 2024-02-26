import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import { useEffect, useState } from 'react';
import { IFileData } from 'src/@types/file';
import { IHopDongPhuLuc } from 'src/@types/hopdong';
import { IDataHopDongPhuLuc } from 'src/@types/hopdongmatbang';
import ConfirmDialog from 'src/components/confirm-dialog/ConfirmDialog';
import { TableNoData, useTable } from 'src/components/table';
import { downloadZip, urlToFile } from 'src/utils/fileUtils';
import PhuLucHopDongGridView from './phu-luc-hop-dong/PhuLucHopDongGridView';

type Props = {
  dataFile: IFileData[];
  dataPhuLuc: IHopDongPhuLuc[];
  soHopDong: string;
};
const FILE_PHU_LUC = 'file_phu_luc';
export default function DanhSachPhuLuc({ dataFile, dataPhuLuc, soHopDong }: Props) {
  const table = useTable({ defaultRowsPerPage: 10 });
  const [openConfirm, setOpenConfirm] = useState(false);
  const [tranFormsData, setTranFormsData] = useState<IDataHopDongPhuLuc[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const transformedData = await Promise.all(
        dataPhuLuc.map(async (pl) => {
          const matchingItem = dataFile.filter((file) => file.hopDongPhuLucId === pl.id);
          if (matchingItem) {
            const promises = matchingItem.map(async (item) => {
              const temp = await urlToFile(
                `${process.env.NEXT_PUBLIC_STORAGE_ENDPOINT}/${item.path}`
              );
              return {
                file: temp,
                id: item.id,
                createdAt: item.createdAt,
                path: item.path,
                loai: item.loai,
              };
            });
            const dataFileFromUrl = await Promise.all(promises);
            return {
              file: dataFileFromUrl,
              phuLuc: { ...pl },
            };
          }
          return {
            file: [],
            phuLuc: { ...pl },
          };
        })
      );

      setTranFormsData(transformedData);
    };

    fetchData();
  }, [dataFile, dataPhuLuc]);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };
  const handleDownloadMultiFile = (selected: string[]) => {
    const fileData: IFileData[] = [];
    if (tranFormsData.length > 0) {
      tranFormsData.forEach((item) => {
        const temp: IFileData[] = item.file.filter((row) => selected.includes(row.id.toString()));
        fileData.push(...temp);
      });
    }
    downloadZip(`${process.env.NEXT_PUBLIC_STORAGE_ENDPOINT}`, fileData, soHopDong, FILE_PHU_LUC);
  };
  return (
    <Box>
      {tranFormsData.length > 0 ? (
        <PhuLucHopDongGridView
          data={tranFormsData}
          table={table}
          onOpenConfirm={handleOpenConfirm}
        />
      ) : (
        <Table>
          <TableHead />
          <TableBody>
            <TableNoData title="Phụ lục chưa có dữ liệu" isNotFound={!tranFormsData.length} />
          </TableBody>
        </Table>
      )}

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Tải xuống"
        content={
          <>
            Bạn có chắc chắn tải xuống <strong> {table.selected.length} </strong> file này?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDownloadMultiFile(table.selected);
              handleCloseConfirm();
            }}
          >
            Tải
          </Button>
        }
      />
    </Box>
  );
}
