// next
import {
  Card,
  Container,
  IconButton,
  MenuItem,
  Table,
  TableBody,
  TableContainer,
  Tooltip,
} from '@mui/material';
import Head from 'next/head';
import { useEffect, useMemo, useState } from 'react';
import MenuPopover from 'src/components/menu-popover/MenuPopover';
// layouts
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/CustomBreadcrumbs';
import Iconify from 'src/components/iconify/Iconify';
import { PATH_CATEGORY } from 'src/routes/paths';
// components
import equal from 'fast-deep-equal';
import isNil from 'lodash/isNil';
import { IDmLoaiPhongMayPhatDien } from 'src/@types/category';
import Scrollbar from 'src/components/scrollbar/Scrollbar';
import { useSettingsContext } from 'src/components/settings';
import {
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableSelectedAction,
  TableSkeleton,
  getComparator,
  useTable,
} from 'src/components/table';
import { CHUA_SU_DUNG, DANG_SU_DUNG } from 'src/constants';
import { useDmLoaiPhongMayPhatDiensQuery } from 'src/data/dmLoaiPhongMayPhatDien';
import DashboardLayout from 'src/layouts/dashboard/DashboardLayout';
import AddNewButtonDanhMuc from 'src/sections/category/components/add-new-button';
import LoaiPhongMayPhatDienCreateCreate from 'src/sections/category/loai-phong-may-phat-dien/LoaiPhongMayPhatDienCreate';
import LoaiPhongMayPhatDienTableRow from 'src/sections/category/loai-phong-may-phat-dien/LoaiPhongMayPhatDienTableRow';
import LoaiPhongMayPhatDienTableToolbar from 'src/sections/category/loai-phong-may-phat-dien/LoaiPhongMayPhatDienTableToolbar';

const STATUS_OPTIONS = [DANG_SU_DUNG, CHUA_SU_DUNG];
const WIDTH_MENU_POPOVER = 177;
const TABLE_HEAD = [
  { id: 'ma', label: 'Mã', align: 'left' },
  { id: 'ten', label: 'Tên', align: 'left' },
  { id: 'ghiChu', label: 'Ghi chú', align: 'left', width: 200 },
  { id: 'createdAt', label: 'Ngày tạo', align: 'center' },
];

// ----------------------------------------------------------------------

LoaiPhongMayPhatDienPage.getLayout = (page: React.ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);

// ----------------------------------------------------------------------

export default function LoaiPhongMayPhatDienPage() {
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

  const { data, isLoading, isError, isFetching } = useDmLoaiPhongMayPhatDiensQuery({
    refetchOnWindowFocus: false,
  });

  const { themeStretch } = useSettingsContext();
  const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);
  const [tableData, setTableData] = useState<IDmLoaiPhongMayPhatDien[]>([]);
  const [dataRow, setDataRow] = useState<IDmLoaiPhongMayPhatDien | null>(null);
  const [filterName, setFilterName] = useState('');
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');

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
      }).map((row, index) => ({
        ...row,
        no: index + 1,
      })),
    [tableData, order, orderBy, filterName]
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
  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setOpenPopover(event.currentTarget);
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
  const handleEditRow = (row: IDmLoaiPhongMayPhatDien) => {
    setDataRow(row);
    setOpenCreate(true);
  };
  return (
    <>
      <Head>
        <title>Danh mục | Loại phòng máy phát điện</title>
      </Head>
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Loại phòng máy phát điện"
          links={[
            { name: 'Danh mục', href: PATH_CATEGORY.root },
            { name: 'Loại phòng máy phát điện' },
          ]}
          action={<AddNewButtonDanhMuc onOpenPopover={handleOpenPopover} />}
        />
        <Card>
          <LoaiPhongMayPhatDienTableToolbar
            isFiltered={isFiltered}
            filterName={filterName}
            filterStatus={filterStatus}
            optionsStatus={STATUS_OPTIONS}
            onFilterName={handleFilterName}
            onFilterStatus={handleFilterStatus}
            onResetFilter={handleResetFilter}
          />
          {!isFetching ? (
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
                      .map((row, index) => (
                        <LoaiPhongMayPhatDienTableRow
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
                          ? 'Dữ liệu danh sách loại phòng máy đang trống'
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
          ) : (
            <TableSkeleton countRow={rowsPerPage} />
          )}

          <TablePaginationCustom
            count={dataFiltered.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
          />
        </Card>
      </Container>
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
        <LoaiPhongMayPhatDienCreateCreate
          title={
            dataRow ? 'Cập nhật loại phòng máy phát điện' : 'Thêm mới loại phòng máy phát điện'
          }
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
}: {
  inputData: IDmLoaiPhongMayPhatDien[];
  comparator: (a: any, b: any) => number;
  filterName: string;
}) {
  if (!inputData.length) return [];

  if (filterName) {
    const filterNameTrimSpace = filterName.trimStart().trimEnd();
    inputData = inputData.filter((user) => {
      let maFilter = false;
      if (!isNil(user?.ma)) {
        maFilter = user.ma.toLowerCase().indexOf(filterNameTrimSpace.toLowerCase()) !== -1;
      }
      let tenFilter = false;
      if (!isNil(user?.ten)) {
        tenFilter = user.ten.toLowerCase().indexOf(filterNameTrimSpace.toLowerCase()) !== -1;
      }
      return maFilter || tenFilter;
    });
  }
  return inputData;
}
