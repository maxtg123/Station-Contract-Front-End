import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import Tooltip from '@mui/material/Tooltip';
import { Packer } from 'docx';
import { saveAs } from 'file-saver';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { IHopDongTramList } from 'src/@types/hopdong';
import Iconify from 'src/components/iconify/Iconify';
import Scrollbar from 'src/components/scrollbar/Scrollbar';
import { TableHeadCustom, useTable } from 'src/components/table';
import { HEAD_HOP_DONG_TRAM_LIST } from 'src/constants/hopdongmatbang.constant';
import { createKyThanhToanDoc } from 'src/templates/hopdong/kyThanhToanDocumentCreator';
import ChiTietTramDialog from './ChiTietTramDialog';
import TramListTableRow from './TramListTableRow';

type Props = {
  data: IHopDongTramList[];
};
const LichSuThanhToanDialog = dynamic(
  () => import('src/components/dialogs/lichsu-thanhtoan-dialog')
);
export default function TramList({ data }: Props) {
  const {
    order,
    orderBy,
    //
    selected,
    //
    onSort,
  } = useTable();
  const [tableData, setTableData] = useState<IHopDongTramList[]>([]);
  const [openChiTietTram, setOpenChiTietTram] = useState(false);
  const [dataRow, setDataRow] = useState<IHopDongTramList | null>(null);
  const [openViewLichSuThanhToan, setOpenViewLichSuThanhToan] = useState(false);
  useEffect(() => {
    if (data.length) {
      setTableData(data);
    }
  }, [data]);

  const handleExportKyThanhToan = (row: IHopDongTramList) => {
    const doc = createKyThanhToanDoc({
      kyThanhToan: row.hopDongTramKyThanhToanList.map((ky) => ({
        tuNgay: new Date(ky.tuNgay),
        denNgay: new Date(ky.denNgay),
        soTien: ky.giaTien,
      })),
    });
    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, `Kỳ thanh toán của hợp đồng ${row.tram.maTram}.docx`);
    });
  };
  const handleOpenChiTietTram = (row: IHopDongTramList) => {
    setOpenChiTietTram(true);
    setDataRow(row);
  };
  const handleViewPayments = (row: IHopDongTramList) => {
    setDataRow(row);
    setOpenViewLichSuThanhToan(true);
  };

  const handleCloseViewPayment = () => {
    setDataRow(null);
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
              headLabel={HEAD_HOP_DONG_TRAM_LIST}
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
                <TramListTableRow
                  no={index + 1}
                  key={row.id}
                  row={row}
                  headLabel={HEAD_HOP_DONG_TRAM_LIST}
                  selected={selected.includes(row.id.toString())}
                  onExportKyThanhToan={() => handleExportKyThanhToan(row)}
                  onViewPayments={() => handleViewPayments(row)}
                  onOpenChiTietTram={() => handleOpenChiTietTram(row)}
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
