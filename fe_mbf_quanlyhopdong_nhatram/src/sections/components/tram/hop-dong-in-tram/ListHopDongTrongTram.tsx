import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import equal from 'fast-deep-equal';
import { isNil } from 'lodash';
import { useEffect, useState } from 'react';
import { IHopDong } from 'src/@types/hopdongmatbang';
import Scrollbar from 'src/components/scrollbar/Scrollbar';
import { TableHeadCustom, TableSkeleton, useTable } from 'src/components/table';
import { TABLE_HEAD_HOP_DONG } from 'src/constants/hopdongmatbang.constant';
import { useListHopDongOfTramQuery } from 'src/data/tram';
import ListHopDongTrongTramTableRow from './ListHopDongTrongTamTableRow';

type IProps = {
  tramId: number;
};

export default function ListHopDongTrongTram({ tramId }: IProps) {
  const { data, isLoading, isError, isFetching } = useListHopDongOfTramQuery(tramId || 0, {
    refetchOnWindowFocus: false,
    enabled: tramId !== null,
  });
  const [tableData, setTableData] = useState<IHopDong[]>([]);

  useEffect(() => {
    if (!isLoading && !isError && !isNil(data) && !equal(data, tableData)) {
      if (data) {
        setTableData(data);
      }
    }
  }, [isLoading, isError, data, tableData]);
  const { order, orderBy, onSort } = useTable();
  return (
    <>
      {!isFetching ? (
        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <Scrollbar>
            <Table size="small" sx={{ minWidth: 800 }}>
              <TableHeadCustom
                headLabel={TABLE_HEAD_HOP_DONG}
                order={order}
                orderBy={orderBy}
                onSort={onSort}
              />
              <TableBody>
                {tableData.map((row, index) => (
                  <ListHopDongTrongTramTableRow
                    no={index + 1}
                    key={row.id + row.soHopDong}
                    row={row}
                    headLabel={TABLE_HEAD_HOP_DONG}
                  />
                ))}
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>
      ) : (
        <TableSkeleton countRow={1} />
      )}
    </>
  );
}
