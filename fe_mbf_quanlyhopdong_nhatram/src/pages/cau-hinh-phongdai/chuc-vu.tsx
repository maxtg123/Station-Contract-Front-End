import { Tab, Tabs } from '@mui/material';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import equal from 'fast-deep-equal';
import groupBy from 'lodash/groupBy';
import isNil from 'lodash/isNil';
import Head from 'next/head';
import React, { useEffect, useMemo, useState } from 'react';
import { IChucVuRow } from 'src/@types/chucvu';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import Iconify from 'src/components/iconify/Iconify';
import { LabelColor } from 'src/components/label';
import Label from 'src/components/label/Label';
import PermissionWrapper from 'src/components/permission-wrapper';
import Scrollbar from 'src/components/scrollbar/Scrollbar';
import { useSettingsContext } from 'src/components/settings';
import {
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableSkeleton,
  getComparator,
  useTable,
} from 'src/components/table';
import { CHUA_SU_DUNG, DANG_SU_DUNG } from 'src/constants';
import { useChucvusQuery } from 'src/data/chucvu';
import useAuthCredentials from 'src/hooks/useAuthCredentials';
import DashboardLayout from 'src/layouts/dashboard';
import { PATH_DASHBOARD, PATH_SETTING_PD } from 'src/routes/paths';
import CauHinhDialog from 'src/sections/chucvu/CauHinhDialog';
import ChucVuTableRow from 'src/sections/chucvu/table/ChucVuTableRow';
import ChucVuTableToolbar from 'src/sections/chucvu/table/ChucVuTableToolbar';

ChucVuPage.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

type ITab = { value: string; label: string; count: number; color: LabelColor };

const TABLE_HEAD = [
  { id: 'ten', label: 'Tên', align: 'left' },
  { id: 'phongDai', label: 'Phòng/Đài', align: 'left' },
  { id: 'ghichu', label: 'Ghi chú', align: 'left' },
  { id: 'numberOfUser', label: 'Số lượng người dùng', align: 'left' },
  { id: 'createdAt', label: 'Ngày tạo', align: 'center', width: 200 },
  { id: 'status', label: 'Trạng thái', align: 'center' },
];
const STATUS_OPTIONS = [DANG_SU_DUNG, CHUA_SU_DUNG];

// ----------------------------------------------------------------------

export default function ChucVuPage() {
  const { listPhanQuyenChinh } = useAuthCredentials();
  const { order, orderBy, onSort, page, rowsPerPage, setPage, onChangePage, onChangeRowsPerPage } =
    useTable();
  const { themeStretch } = useSettingsContext();

  const [tableData, setTableData] = useState<IChucVuRow[]>([]);
  const [tabs, setTabs] = useState<ITab[]>([]);
  const [dataRow, setDataRow] = useState<IChucVuRow | null>(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPhongDai, setFilterPhongDai] = useState('all');
  const [filterName, setFilterName] = useState('');

  const { data, isLoading, isError, isFetching } = useChucvusQuery({ refetchOnWindowFocus: false });

  // set init data table
  useEffect(() => {
    if (!isLoading && !isError && !isNil(data) && !equal(data, tableData)) {
      const groupData = groupBy(data, 'dmPhongDai.ten');
      const pds = Object.keys(groupData);
      const allTab: ITab = { value: 'all', label: 'Tất cả', count: data.length, color: 'info' };
      const _tabs: ITab[] = [allTab];

      if (pds.length >= 2) {
        pds.forEach((pd) => {
          _tabs.push({
            value: pd,
            label: pd,
            count: groupData[pd].length,
            color: 'success',
          });
        });
      }
      setTabs(_tabs);
      setTableData(data);
    }
  }, [isLoading, isError, data, tableData]);

  const dataFiltered = useMemo(
    () =>
      applyFilter({
        inputData: tableData,
        comparator: getComparator(order, orderBy),
        filterName,
        filterStatus,
        filterPhongDai,
      }).map((row, index) => ({
        ...row,
        no: index + 1,
      })),
    [tableData, order, orderBy, filterName, filterStatus, filterPhongDai]
  );

  const isFiltered = filterName !== '' || filterStatus !== '';

  const handleFilterName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleFilterStatus = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(0);
    setFilterStatus(event.target.value);
  };

  const handleFilterPhongDai = (event: React.SyntheticEvent<Element, Event>, newValue: string) => {
    setPage(0);
    setFilterPhongDai(newValue);
  };

  const handleResetFilter = () => {
    setFilterName('');
    setFilterStatus('');
  };

  // dialog
  const [openDialog, setOpen] = React.useState(false);
  const handleOpenDialog = (row: IChucVuRow | null) => {
    setOpen(true);
    setDataRow(row);
  };
  const handleClose = (value: boolean) => {
    setOpen(false);
  };

  return (
    <>
      <Head>
        <title>Quản lý chức vụ</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Danh sách chức vụ"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Cấu hình phòng đài', href: PATH_SETTING_PD.nguoiDung },
            { name: 'Chức vụ' },
          ]}
          action={
            <PermissionWrapper module="CHUC_VU" action="THEM_MOI" hideWhenBlocked checkAt="pdChinh">
              <Button
                variant="contained"
                onClick={() => {
                  handleOpenDialog(null);
                }}
                startIcon={<Iconify icon="eva:plus-fill" />}
              >
                Thêm mới
              </Button>
            </PermissionWrapper>
          }
        />

        <Card sx={{ mb: 5 }}>
          <Tabs
            value={filterPhongDai}
            onChange={handleFilterPhongDai}
            sx={{
              px: 2,
              bgcolor: 'background.neutral',
            }}
          >
            {tabs.map((tab) => (
              <Tab
                key={tab.value}
                value={tab.value}
                label={tab.label}
                icon={
                  <Label color={tab.color} sx={{ mr: 1 }}>
                    {tab.count}
                  </Label>
                }
              />
            ))}
          </Tabs>
          <ChucVuTableToolbar
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
              <Scrollbar>
                <Table sx={{ minWidth: 800 }} size="medium">
                  <TableHeadCustom
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    onSort={onSort}
                  />
                  <TableBody>
                    {dataFiltered
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row, i) => (
                        <ChucVuTableRow
                          no={row.no}
                          key={row.id}
                          row={row}
                          onEditRow={() => {
                            handleOpenDialog(row);
                          }}
                        />
                      ))}

                    <TableNoData
                      title={
                        !isFiltered
                          ? 'Dữ liệu chức vụ đang trống'
                          : 'Không tìm thấy dữ liệu được tìm kiếm'
                      }
                      isNotFound={dataFiltered.length === 0}
                      haveBtnCreate={
                        !!listPhanQuyenChinh.find(
                          (q) => q.module === 'CHUC_VU' && q.action === 'THEM_MOI'
                        )
                      }
                      handleOpenCreate={() => {
                        handleOpenDialog(null);
                      }}
                    />
                  </TableBody>
                </Table>
              </Scrollbar>
            </TableContainer>
          ) : (
            <TableSkeleton countRow={rowsPerPage} />
          )}
          <TablePaginationCustom
            count={data ? data.length : 0}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
          />
        </Card>

        {openDialog && (
          <CauHinhDialog
            initData={
              dataRow
                ? {
                    id: dataRow.id,
                    ten: dataRow.ten,
                    phongDai: {
                      value: dataRow.dmPhongDai.id.toString(),
                      label: dataRow.dmPhongDai.ten,
                    },
                    ghichu: dataRow?.ghichu || '',
                    chucVuPhanQuyenList: dataRow.chucVuPhanQuyenList,
                  }
                : null
            }
            open={openDialog}
            onClose={handleClose}
          />
        )}
      </Container>
    </>
  );
}

function applyFilter({
  inputData,
  comparator,
  filterName,
  filterStatus,
  filterPhongDai,
}: {
  inputData: IChucVuRow[];
  comparator: (a: any, b: any) => number;
  filterName: string;
  filterStatus: string;
  filterPhongDai: string;
}) {
  if (!inputData.length) return [];

  if (filterName) {
    const filterNameTrimSpace = filterName.trimStart().trimEnd();
    inputData = inputData.filter((cv) => {
      let tenFilter = false;
      if (!isNil(cv?.ten)) {
        tenFilter = cv.ten.toLowerCase().indexOf(filterNameTrimSpace.toLowerCase()) !== -1;
      }
      let ghiChuFilter = false;
      if (!isNil(cv?.ghichu)) {
        ghiChuFilter = cv.ghichu.toLowerCase().indexOf(filterNameTrimSpace.toLowerCase()) !== -1;
      }

      return tenFilter || ghiChuFilter;
    });
  }
  if (filterPhongDai !== 'all') {
    inputData = inputData.filter((cv) => cv.dmPhongDai.ten === filterPhongDai);
  }

  if (filterStatus !== '') {
    inputData = inputData.filter((cv) => {
      if (filterStatus === DANG_SU_DUNG && cv.usedStatus) return true;
      if (filterStatus === CHUA_SU_DUNG && !cv.usedStatus) return true;
      return false;
    });
  }

  return inputData;
}
