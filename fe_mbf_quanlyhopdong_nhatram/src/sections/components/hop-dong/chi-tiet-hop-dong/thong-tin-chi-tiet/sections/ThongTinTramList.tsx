import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import Tooltip from '@mui/material/Tooltip';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { IHopDongTramList } from 'src/@types/hopdong';
import Iconify from 'src/components/iconify/Iconify';
import Scrollbar from 'src/components/scrollbar/Scrollbar';
import { TableHeadCustom, useTable } from 'src/components/table';
import { HEAD_HOP_DONG_MAT_BANG_THONG_TIN_TRAM_DETAIL } from 'src/constants/hopdongmatbang.constant';
import ChiTietTramDialog from 'src/sections/components/hop-dong/tram-list/ChiTietTramDialog';
import ThongTinTramListTableRow from './ThongTinTramListTableRow';

type Props = {
  data: IHopDongTramList[];
};

const LichSuThanhToanDialog = dynamic(
  () => import('src/components/dialogs/lichsu-thanhtoan-dialog')
);

export default function ThongTinTramList({ data }: Props) {
  const {
    order,
    orderBy,
    //
    selected,
    //
    onSort,
  } = useTable();
  const [tableData, setTableData] = useState<IHopDongTramList[]>([]);
  const [dataRow, setDataRow] = useState<IHopDongTramList | null>(null);
  const [openChiTietTram, setOpenChiTietTram] = useState(false);
  const [openViewLichSuThanhToan, setOpenViewLichSuThanhToan] = useState(false);

  useEffect(() => {
    if (data.length) {
      setTableData(data);
    }
  }, [data]);
  const handleOpenChiTiet = (row: IHopDongTramList) => {
    setOpenChiTietTram(true);
    setDataRow(row);
  };
  const handleViewPayments = (row: IHopDongTramList) => {
    setOpenViewLichSuThanhToan(true);
    setDataRow(row);
  };
  const handleCloseViewPayment = () => {
    setOpenViewLichSuThanhToan(false);
  };
  return (
    <>
      <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
        <Scrollbar>
          <Table size="small" sx={{ width: '100%' }}>
            <TableHeadCustom
              order={order}
              orderBy={orderBy}
              headLabel={HEAD_HOP_DONG_MAT_BANG_THONG_TIN_TRAM_DETAIL}
              onSort={onSort}
              tooltips={[
                {
                  id: 'tinhTrangThanhToan',
                  component: (
                    <Tooltip title="Tính đến ngày hiện tại">
                      <IconButton color="default">
                        <Iconify icon="eva:alert-circle-fill" />
                      </IconButton>
                    </Tooltip>
                  ),
                },
              ]}
            />
            <TableBody>
              {tableData.map((row, index) => (
                <ThongTinTramListTableRow
                  key={row.id}
                  row={row}
                  headLabel={HEAD_HOP_DONG_MAT_BANG_THONG_TIN_TRAM_DETAIL}
                  selected={selected.includes(row.id.toString())}
                  onOpenChiTietTram={() => handleOpenChiTiet(row)}
                  onViewLichSuThanhToan={() => handleViewPayments(row)}
                />
              ))}
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>
      {openChiTietTram && (
        <ChiTietTramDialog
          open
          onClose={() => setOpenChiTietTram(false)}
          id={dataRow?.tram?.id ?? 0}
        />
      )}
      {dataRow && openViewLichSuThanhToan && (
        <LichSuThanhToanDialog open onClose={handleCloseViewPayment} data={dataRow} />
      )}
    </>
  );
}
