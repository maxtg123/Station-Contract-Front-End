import { Card, Table, TableBody, TableContainer } from '@mui/material';
import equal from 'fast-deep-equal';
import isNil from 'lodash/isNil';
import { useEffect, useState } from 'react';
import { IHopDongLichSu } from 'src/@types/hopDongLichSu';
import { IHead } from 'src/@types/common';
import Scrollbar from 'src/components/scrollbar/Scrollbar';
import {
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableSkeleton,
  useTable,
} from 'src/components/table';
import { TABLE_HEAD_LICH_SU_HD } from 'src/constants/hopDongLichSu.constant';
import { useHopDongLichSuQuery } from 'src/data/hopDongLichSu';
import LichSuHDTableRow from 'src/sections/hopdongmatbang/lich-su/LichSuHDTableRow';

type Props = {
  hopDongId: number;
}

const TabLichSuHopDong = ({hopDongId}: Props) => {
  const { dense, page, setPage, rowsPerPage, onChangePage, onChangeRowsPerPage, onChangeDense } =
    useTable({ defaultRowsPerPage: 10 });
  const [headerTable, setHeaderTable] = useState<IHead[]>(TABLE_HEAD_LICH_SU_HD);
  const [tableData, setTableData] = useState<IHopDongLichSu[]>([]);

  const { data, isLoading, isError } = useHopDongLichSuQuery(
    {
      size: rowsPerPage,
      page,
      hopDongId: hopDongId,
    },
    { refetchOnWindowFocus: false }
  );

  useEffect(() => {
    if (
      !isLoading &&
      !isError &&
      !isNil(data?.elements) &&
      !equal(data?.elements, tableData)
    ) {
      if (data?.elements) {
        setTableData(data.elements);
      }
    }
  }, [isLoading, isError, data, tableData]);
  const dataEmpty = !tableData.length;

  return (
    <Card sx={{ mb: 5 }}>
      {!isLoading ? (
        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <Scrollbar>
            <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
              <TableHeadCustom headLabel={headerTable} />
              <TableBody>
                {tableData.map((row, index) => (
                  <LichSuHDTableRow headLabel={headerTable} no={index + 1} key={index} row={row} />
                ))}
                <TableNoData title="Dữ liệu lịch sử hợp đồng đang trống" isNotFound={dataEmpty} />
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>
      ) : (
        <TableSkeleton countRow={rowsPerPage} />
      )}

      <TablePaginationCustom
        count={data?.metadata?.total || 0}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={onChangePage}
        onRowsPerPageChange={onChangeRowsPerPage}
        dense={dense}
        onChangeDense={onChangeDense}
      />
    </Card>
  );
};

export default TabLichSuHopDong;
