import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import Tooltip from '@mui/material/Tooltip';
import equal from 'fast-deep-equal';
import isNil from 'lodash/isNil';
import Head from 'next/head';
import { useEffect, useMemo, useState } from 'react';
import { IDmDoiTuongKyHopDong } from 'src/@types/category';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/CustomBreadcrumbs';
import Iconify from 'src/components/iconify/Iconify';
import MenuPopover from 'src/components/menu-popover/MenuPopover';
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
import { useDmDoiTuongKyHopDongsQuery } from 'src/data/dmDoiTuongKyHopDong';
import DashboardLayout from 'src/layouts/dashboard/DashboardLayout';
import { PATH_CATEGORY } from 'src/routes/paths';
import AddNewButtonDanhMuc from 'src/sections/category/components/add-new-button';
import DoiTuongKyHopDongCreate from 'src/sections/category/doi-tuong-ky-hop-dong/DoiTuongKyHopDongCreate';
import DoiTuongKyHopDongTableRow from 'src/sections/category/doi-tuong-ky-hop-dong/DoiTuongKyHopDongTableRow';
import DoiTuongKyHopDongTableToolbar from 'src/sections/category/doi-tuong-ky-hop-dong/DoiTuongKyHopDongTableToolbar';

const LOAI_DOI_TUONG = [
  { id: 'PHAP_NHAN', ten: 'Pháp nhân' },
  { id: 'CA_NHAN', ten: 'Cá nhân' },
  { id: 'KHAC', ten: 'Khác' },
];
const WIDTH_MENU_POPOVER = 177;
const TABLE_HEAD = [
  { id: 'ten', label: 'Tên', align: 'left' },
  { id: 'ma', label: 'Mã', align: 'left' },
  { id: 'loaiDoiTuong', label: 'Loại đối tượng', align: 'left' },
  { id: 'ghiChu', label: 'Ghi chú', align: 'left' },
  { id: 'createdAt', label: 'Ngày tạo', align: 'center', width: 200 },
  // { id: 'trangthai', label: 'Trạng thái', align: 'left' },
];

// ----------------------------------------------------------------------
DoiTuongHopDongPage.getLayout = (page: React.ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);
// ----------------------------------------------------------------------

export default function DoiTuongHopDongPage() {
  const { themeStretch } = useSettingsContext();
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
  const [tableData, setTableData] = useState<IDmDoiTuongKyHopDong[]>([]);
  const [dataRow, setDataRow] = useState<IDmDoiTuongKyHopDong | null>(null);
  const [filterName, setFilterName] = useState('');
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [loaiDoiTuong, setFilterLoaiDT] = useState('');

  const { data, isLoading, isError, isFetching } = useDmDoiTuongKyHopDongsQuery({
    refetchOnWindowFocus: false,
  });
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
        loaiDoiTuong,
      }).map((row, index) => ({
        ...row,
        no: index + 1,
      })),
    [tableData, order, orderBy, filterName, loaiDoiTuong]
  );
  const isFiltered = filterName !== '' || loaiDoiTuong !== '';
  const isNotFound =
    (!dataFiltered.length && !filterName) || (!dataFiltered.length && !loaiDoiTuong);
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

  const handleFilterLoaiDT = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(0);
    setFilterLoaiDT(event.target.value);
  };
  const handleResetFilter = () => {
    setFilterName('');
    setFilterLoaiDT('');
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
      <Head>
        <title>Danh mục | Đối tượng ký hợp đồng</title>
      </Head>
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Đối tượng ký hợp đồng"
          links={[
            { name: 'Danh mục', href: PATH_CATEGORY.root },
            { name: 'Đối tượng ký hợp đồng' },
          ]}
          action={<AddNewButtonDanhMuc onOpenPopover={handleOpenPopover} />}
        />
        <Card>
          <DoiTuongKyHopDongTableToolbar
            isFiltered={isFiltered}
            filterName={filterName}
            loaiDoiTuong={loaiDoiTuong}
            loaiDTStatus={LOAI_DOI_TUONG}
            onFilterName={handleFilterName}
            onFilterLoaiDT={handleFilterLoaiDT}
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
                        <DoiTuongKyHopDongTableRow
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
                          ? 'Dữ liệu đối tượng ký hợp đồng đang trống'
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
        <DoiTuongKyHopDongCreate
          title={dataRow ? 'Cập nhật Đối tượng ký hợp đồng' : 'Thêm mới Đối tượng ký hợp đồng'}
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
  loaiDoiTuong,
}: {
  inputData: IDmDoiTuongKyHopDong[];
  comparator: (a: any, b: any) => number;
  filterName: string;
  loaiDoiTuong: string;
}) {
  if (!inputData.length) return [];

  if (filterName) {
    const filterNameTrimSpace = filterName.trimStart().trimEnd();
    inputData = inputData.filter((dt) => {
      let tenFilter = false;
      if (!isNil(dt?.ten)) {
        tenFilter = dt.ten.toLowerCase().indexOf(filterNameTrimSpace.toLowerCase()) !== -1;
      }
      let maFilter = false;
      if (!isNil(dt?.ma)) {
        maFilter = dt.ma.toLowerCase().indexOf(filterNameTrimSpace.toLowerCase()) !== -1;
      }
      let ghiChuFilter = false;
      if (!isNil(dt?.ghiChu)) {
        ghiChuFilter = dt.ghiChu.toLowerCase().indexOf(filterNameTrimSpace.toLowerCase()) !== -1;
      }

      return tenFilter || maFilter || ghiChuFilter;
    });
  }

  if (loaiDoiTuong !== '') {
    inputData = inputData.filter((dt) => dt.loaiDoiTuong === loaiDoiTuong);
  }

  return inputData;
}
