import { Box, Table, TableBody, TableContainer } from '@mui/material';
import equal from 'fast-deep-equal';
import isNil from 'lodash/isNil';
import { memo, useEffect, useMemo, useState } from 'react';
import { IHopDong } from 'src/@types/hopdongmatbang';
import Scrollbar from 'src/components/scrollbar/Scrollbar';
import {
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableSkeleton,
  getComparator,
  useTable,
} from 'src/components/table';
import { HEAD_HOP_DONG_MAT_BANG_DA_GUI_PHE_DUYET } from 'src/constants/hopdongmatbang.constant';
import { useHopDongQuery } from 'src/data/hopDongMatBang';
import Row from './Row';
import Toolbar from './Toolbar';

const TabDaGuiPheDuyet = () => {
  const [tableData, setTableData] = useState<IHopDong[]>([]);
  const [filterName, setFilterName] = useState<string>('');

  const {
    dense,
    page,
    rowsPerPage,
    setPage,
    order,
    orderBy,
    //
    selected,
    //
    onChangePage,
    onChangeRowsPerPage,
    onChangeDense,
  } = useTable();

  const { data, isLoading, isError } = useHopDongQuery(
    {
      page,
      size: rowsPerPage,
      trangThaiHopDong: 'CHO_PHE_DUYET',
      loaiHopDong: 'MAT_BANG',
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    if (!isLoading && !isError && !isNil(data?.elements) && !equal(data?.elements, tableData)) {
      if (data?.elements) {
        setTableData(data.elements);
      }
    }
  }, [isLoading, isError, data, tableData]);

  const dataFiltered = useMemo(
    () =>
      applyFilter({
        inputData: tableData,
        comparator: getComparator(order, orderBy),
        filterName,
      }),
    [tableData, order, orderBy, filterName]
  );

  const isFiltered = filterName !== '';
  const isNotFound = !dataFiltered.length && isFiltered;
  const dataEmpty = !dataFiltered.length && filterName === '';
  const handleFilterName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleResetFilter = () => {
    setFilterName('');
  };

  return (
    <Box>
      <Toolbar
        filterName={filterName}
        isFiltered={isFiltered}
        onFilterName={handleFilterName}
        onResetFilter={handleResetFilter}
      />
      {!isLoading ? (
        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <Scrollbar>
            <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
              <TableHeadCustom
                headLabel={HEAD_HOP_DONG_MAT_BANG_DA_GUI_PHE_DUYET}
                rowCount={dataFiltered.length}
                numSelected={selected.length}
                isStickyActionHead
              />
              <TableBody>
                {dataFiltered.map((row) => (
                  <Row
                    key={row.id + row.soHopDong}
                    row={row}
                    selected={selected.includes(row.id.toString())}
                    headLabel={HEAD_HOP_DONG_MAT_BANG_DA_GUI_PHE_DUYET}
                  />
                ))}
                <TableNoData
                  title={
                    !isFiltered
                      ? 'Dữ liệu đã gửi phê duyệt hợp đồng mặt bằng đang trống'
                      : 'Không tìm thấy dữ liệu được tìm kiếm'
                  }
                  isNotFound={!isFiltered ? dataEmpty : isNotFound}
                />
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
    </Box>
  );
};

function applyFilter({
  inputData,
  comparator,
  filterName,
}: {
  inputData: IHopDong[];
  comparator: (a: any, b: any) => number;
  filterName: string;
}) {
  if (!inputData.length) return [];
  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    const filterNameTrimSpace = filterName.trimStart().trimEnd();
    inputData = inputData.filter((item) => {
      let soHopDongFilter = false;
      if (!isNil(item?.soHopDong)) {
        soHopDongFilter =
          item.soHopDong.toLowerCase().indexOf(filterNameTrimSpace.toLowerCase()) !== -1;
      }
      let soHopDongErpFilter = false;
      if (!isNil(item?.soHopDongErp)) {
        soHopDongErpFilter =
          item.soHopDongErp.toLowerCase().indexOf(filterNameTrimSpace.toLowerCase()) !== -1;
      }
      let maTramFilter = false;
      if (!isNil(item?.hopDongTramList)) {
        maTramFilter = item.hopDongTramList.some((el) =>
          el.tram?.maTram?.toLowerCase().includes(filterNameTrimSpace.toLowerCase())
        );
      }
      let maTramErpFilter = false;
      if (!isNil(item?.hopDongTramList)) {
        maTramErpFilter = item.hopDongTramList.some((el) =>
          el.tram?.maTramErp?.toLowerCase().includes(filterNameTrimSpace.toLowerCase())
        );
      }
      let maDTXDFilter = false;
      if (!isNil(item?.hopDongTramList)) {
        maDTXDFilter = item.hopDongTramList.some((el) =>
          el.tram?.maDauTuXayDung?.toLowerCase().includes(filterNameTrimSpace.toLowerCase())
        );
      }

      return (
        soHopDongFilter || soHopDongErpFilter || maTramFilter || maTramErpFilter || maDTXDFilter
      );
    });
  }

  return inputData;
}

export default memo(TabDaGuiPheDuyet);
