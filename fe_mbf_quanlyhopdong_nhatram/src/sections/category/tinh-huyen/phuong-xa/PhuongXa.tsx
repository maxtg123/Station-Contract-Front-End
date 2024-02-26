import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import Tooltip from '@mui/material/Tooltip';
import equal from 'fast-deep-equal';
import isNil from 'lodash/isNil';
import React, { useEffect, useMemo, useState } from 'react';
import { IDmXa } from 'src/@types/category';
import Iconify from 'src/components/iconify/Iconify';
import MenuPopover from 'src/components/menu-popover/MenuPopover';
import Scrollbar from 'src/components/scrollbar/Scrollbar';
import {
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableSelectedAction,
  getComparator,
  useTable,
} from 'src/components/table';
import { CHUA_SU_DUNG, DANG_SU_DUNG } from 'src/constants';
import { useDmXasQuery } from 'src/data/dmXa';
import PhuongXaCreate from './PhuongXaCreate';
import PhuongXaTableRow from './PhuongXaTableRow';
import PhuongXaTableToolbar from './PhuongXaTableToolbar';

type Props = {
  id: number;
};
const STATUS_OPTIONS = [DANG_SU_DUNG, CHUA_SU_DUNG];
const WIDTH_MENU_POPOVER = 177;
const TABLE_HEAD = [
  { id: 'ma', label: 'Mã Phường Xã', align: 'left' },
  { id: 'ten', label: 'Tên Phường Xã', align: 'left' },
  { id: 'ghiChu', label: 'Ghi chú', align: 'left' },
  { id: 'createdAt', label: 'Ngày tạo', align: 'center', width: 150 },
  // { id: 'trangthai', label: 'Trạng thái', align: 'left' },
];
export default function PhuongXa({ id }: Props) {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    onSelectAllRows,
    //
    onSort,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();
  const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);
  const [tableData, setTableData] = useState<IDmXa[]>([]);
  const [dataRow, setDataRow] = useState<IDmXa | null>(null);
  const [filterName, setFilterName] = useState('');
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');

  const { data, isLoading, isError } = useDmXasQuery(id, { refetchOnWindowFocus: false });
  useEffect(() => {
    if (!isLoading && !isError && !isNil(data) && !equal(data, tableData)) {
      setTableData(data.elements);
    }
  }, [isLoading, isError, data, tableData]);

  const dataFiltered = useMemo(
    () =>
      applyFilter({
        inputData: tableData,
        comparator: getComparator(order, orderBy),
        filterName,
        filterStatus,
      }).map((row, index) => ({
        ...row,
        no: index + 1,
      })),
    [tableData, order, orderBy, filterName, filterStatus]
  );
  const isFiltered = filterName !== '' || filterStatus !== '';
  const isNotFound =
    (!dataFiltered.length && !filterName) || (!dataFiltered.length && !filterStatus);
  const handleClickOpenCreate = () => {
    setOpenCreate(true);
  };

  const handleCloseCreate = () => {
    setDataRow(null);
    setOpenCreate(false);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const handleFilterName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleFilterStatus = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(0);
    setFilterStatus(event.target.value);
  };
  const handleResetFilter = () => {
    setFilterName('');
    setFilterStatus('');
  };
  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };
  const handleEditRow = (row: any) => {
    setDataRow(row);
    setOpenCreate(true);
  };
  return (
    <>
      <Card>
        <PhuongXaTableToolbar
          isFiltered={isFiltered}
          filterName={filterName}
          filterStatus={filterStatus}
          optionsStatus={STATUS_OPTIONS}
          onFilterName={handleFilterName}
          onFilterStatus={handleFilterStatus}
          onResetFilter={handleResetFilter}
        />
        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <TableSelectedAction
            dense={dense}
            numSelected={selected.length}
            rowCount={tableData.length}
            onSelectAllRows={(checked) =>
              onSelectAllRows(
                checked,
                tableData.map((row: any) => row.id)
              )
            }
            action={
              <Tooltip title="Delete">
                <IconButton color="primary" onClick={handleOpenConfirm}>
                  <Iconify icon="eva:trash-2-outline" />
                </IconButton>
              </Tooltip>
            }
          />
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
                  .map((row) => (
                    <PhuongXaTableRow
                      no={row.no}
                      key={row.id}
                      row={row}
                      selected={selected.includes(row.id.toString())}
                      onEditRow={() => handleEditRow(row)}
                    />
                  ))}

                <TableNoData
                  title={
                    !isFiltered
                      ? 'Dữ liệu phường / xã đang trống'
                      : 'Không tìm thấy dữ liệu được tìm kiếm'
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
      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="top-right"
        sx={{ width: WIDTH_MENU_POPOVER, marginTop: '10px' }}
      >
        <MenuItem
          onClick={() => {
            handleClickOpenCreate();
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:plus-fill" />
          Thêm mới
        </MenuItem>
      </MenuPopover>
      {openCreate && (
        <PhuongXaCreate
          title={dataRow ? 'Cập nhật Phường / Xã' : 'Thêm mới Phường / Xã'}
          open={openCreate}
          initData={dataRow}
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
  filterStatus,
}: {
  inputData: IDmXa[];
  comparator: (a: any, b: any) => number;
  filterName: string;
  filterStatus: string;
}) {
  if (!inputData.length) return [];

  if (filterName) {
    const filterNameTrimSpace = filterName.trimStart().trimEnd();
    inputData = inputData.filter((user) => {
      let tenFilter = false;
      if (!isNil(user?.ten)) {
        tenFilter = user.ten.toLowerCase().indexOf(filterNameTrimSpace.toLowerCase()) !== -1;
      }
      let maFilter = false;
      if (!isNil(user?.ma)) {
        maFilter = user.ma.toLowerCase().indexOf(filterNameTrimSpace.toLowerCase()) !== -1;
      }
      let ghiChuFilter = false;
      if (!isNil(user?.ghiChu)) {
        ghiChuFilter = user.ghiChu.toLowerCase().indexOf(filterNameTrimSpace.toLowerCase()) !== -1;
      }

      return tenFilter || maFilter || ghiChuFilter;
    });
  }
  // if (filterStatus !== '') {
  //   inputData = inputData.filter((user) => user.trangthai === filterStatus);
  // }

  return inputData;
}
