import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import isNil from 'lodash/isNil';
import React, { useEffect, useMemo, useState } from 'react';
import { IDmTo } from 'src/@types/category';
import Scrollbar from 'src/components/scrollbar/Scrollbar';
import {
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  getComparator,
  useTable,
} from 'src/components/table';
import ToCreate from '../../to/ToCreate';
import ToTableRow from '../../to/ToTableRow';
import ToTableToolbar from '../../to/ToTableToolbar';

type Props = {
  data: IDmTo[];
};
const TABLE_HEAD = [
  { id: 'ten', label: 'Tên', align: 'left' },
  { id: 'tenVietTat', label: 'Tên viết tắt', align: 'left' },
  { id: 'maDataSite', label: 'Mã DataSite', align: 'left' },
  { id: 'phongdai', label: 'Tên phòng đài', align: 'left', width: 220 },
  { id: 'ghiChu', label: 'Ghi chú', align: 'left' },
  { id: 'createdAt', label: 'Ngày tạo', align: 'center', width: 150 },
];
export default function ListTo({ data }: Props) {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    //
    onSort,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();
  const [tableData, setTableData] = useState<IDmTo[]>([]);
  const [dataRow, setDataRow] = useState<IDmTo | null>(null);
  const [filterName, setFilterName] = useState('');
  const [openCreate, setOpenCreate] = useState(false);
  useEffect(() => {
    if (data.length) {
      setTableData(data);
    }
  }, [data]);

  const dataFiltered = useMemo(
    () =>
      applyFilter({
        inputData: tableData,
        comparator: getComparator(order, orderBy),
        filterName,
      }).map((row, index) => ({
        ...row,
        no: index + 1,
      })),
    [tableData, order, orderBy, filterName]
  );
  const isFiltered = filterName !== '';
  const isNotFound = (!dataFiltered.length && isFiltered) || !dataFiltered.length;
  const handleClickOpenCreate = () => {
    setOpenCreate(true);
  };

  const handleCloseCreate = () => {
    setDataRow(null);
    setOpenCreate(false);
  };
  const handleEditRow = (row: IDmTo) => {
    setDataRow(row);
    setOpenCreate(true);
  };
  const handleFilterName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(0);
    setFilterName(event.target.value);
  };
  const handleResetFilter = () => {
    setFilterName('');
  };
  return (
    <>
      <Card>
        <ToTableToolbar
          isFiltered={isFiltered}
          filterName={filterName}
          filterStatus=""
          optionsStatus={[]}
          onFilterName={handleFilterName}
          onFilterStatus={() => {}}
          onResetFilter={handleResetFilter}
        />
        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <Scrollbar>
            <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
              <TableHeadCustom
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                onSort={onSort}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <ToTableRow
                      no={row.no}
                      key={row.id}
                      row={row}
                      selected={selected.includes(row.id.toString())}
                      onEditRow={() => handleEditRow(row)}
                    />
                  ))}

                <TableNoData
                  title={
                    !isFiltered ? 'Dữ liệu tổ đang trống' : 'Không tìm thấy dữ liệu được tìm kiếm'
                  }
                  isNotFound={isNotFound}
                  haveBtnCreate
                  handleOpenCreate={handleClickOpenCreate}
                />
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>
        <TablePaginationCustom
          count={dataFiltered.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={onChangePage}
          onRowsPerPageChange={onChangeRowsPerPage}
        />
      </Card>
      {openCreate && (
        <ToCreate
          title={dataRow ? 'Cập nhật Tổ' : 'Thêm mới Tổ'}
          open={openCreate}
          initData={
            dataRow
              ? {
                  id: dataRow.id.toString(),
                  ten: dataRow.ten || '',
                  tenVietTat: dataRow.tenVietTat || '',
                  maDataSite: dataRow.maDataSite || '',
                  phongDai: {
                    id: dataRow.phongDai.id.toString(),
                    ten: dataRow.phongDai.ten,
                  },
                  ghiChu: dataRow.ghiChu || '',
                }
              : null
          }
          onClose={() => handleCloseCreate()}
        />
      )}
    </>
  );
}

function applyFilter({
  inputData,
  comparator,
  filterName,
}: {
  inputData: IDmTo[];
  comparator: (a: any, b: any) => number;
  filterName: string;
}) {
  if (!inputData.length) return [];

  if (filterName) {
    inputData = inputData.filter((user) => {
      let tenFilter = false;
      if (!isNil(user?.ten)) {
        tenFilter = user.ten.toLowerCase().indexOf(filterName.toLowerCase()) !== -1;
      }
      let tenVietTatFilter = false;
      if (!isNil(user?.tenVietTat)) {
        tenVietTatFilter = user.tenVietTat.toLowerCase().indexOf(filterName.toLowerCase()) !== -1;
      }
      let maFilter = false;
      if (!isNil(user?.maDataSite)) {
        maFilter = user.maDataSite.toLowerCase().indexOf(filterName.toLowerCase()) !== -1;
      }
      let ghiChuFilter = false;
      if (!isNil(user?.ghiChu)) {
        ghiChuFilter = user.ghiChu.toLowerCase().indexOf(filterName.toLowerCase()) !== -1;
      }
      let tenPhongDaiFilter = false;
      if (!isNil(user?.phongDai.ten)) {
        tenPhongDaiFilter =
          user.phongDai.ten.toLowerCase().indexOf(filterName.toLowerCase()) !== -1;
      }
      return tenFilter || tenVietTatFilter || maFilter || ghiChuFilter || tenPhongDaiFilter;
    });
  }
  return inputData;
}
