// next
import { Button, Card, Container, Tab, Tabs } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import equal from 'fast-deep-equal';
import sortBy from 'lodash/sortBy';
import groupBy from 'lodash/groupBy';
import isNil from 'lodash/isNil';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import React, { useEffect, useMemo, useState } from 'react';
import { IChucVuRow } from 'src/@types/chucvu';
import { INguoiDung } from 'src/@types/nguoidung';
import ConfirmDialog from 'src/components/confirm-dialog/ConfirmDialog';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/CustomBreadcrumbs';
import Iconify from 'src/components/iconify/Iconify';
import { LabelColor } from 'src/components/label';
import Label from 'src/components/label/Label';
import PermissionWrapper from 'src/components/permission-wrapper';
import Scrollbar from 'src/components/scrollbar/Scrollbar';
import {
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableSkeleton,
  getComparator,
  useTable,
} from 'src/components/table';
import { DANG_HOAT_DONG, NGUNG_HOAT_DONG } from 'src/constants';
import { useNguoiDungsQuery } from 'src/data/nguoidung';
import useAuthCredentials from 'src/hooks/useAuthCredentials';
import { PATH_DASHBOARD, PATH_SETTING_PD } from 'src/routes/paths';
import NguoiDungTableRow from 'src/sections/nguoidung/table/NguoiDungTableRow';
import NguoiDungTableToolbar from 'src/sections/nguoidung/table/NguoiDungTableToolbar';
import { useSettingsContext } from '../../components/settings';
import DashboardLayout from '../../layouts/dashboard';

const NguoiDungSidebar = dynamic(() => import('src/sections/nguoidung/NguoiDungSidebar'), {
  ssr: false,
});
const XemQuyenNguoiDung = dynamic(() => import('src/sections/nguoidung/XemQuyenNguoiDung'), {
  ssr: false,
});
// ----------------------------------------------------------------------

type ITab = { value: string; label: string; count: number; color: LabelColor };

NguoiDungPage.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;
const STATUS_OPTIONS = [DANG_HOAT_DONG, NGUNG_HOAT_DONG];
const TABLE_HEAD = [
  { id: 'hoTen', label: 'Tên', align: 'left' },
  { id: 'email', label: 'Email', align: 'left' },
  { id: 'chucVu', label: 'Chức vụ chính', align: 'left' },
  { id: 'soDienThoai', label: 'Số điện thoại', align: 'left' },
  { id: 'khuVucKhac', label: 'Khu vực', align: 'center' },
  { id: 'chucVuKhuVuc', label: 'Chức vụ khu vực', align: 'center' },
  { id: 'trangThai', label: 'Trạng thái', align: 'center' },
];

// ----------------------------------------------------------------------

export default function NguoiDungPage() {
  const { listPhanQuyenChinh } = useAuthCredentials();

  const { page, rowsPerPage, order, orderBy, onSort, setPage, onChangePage, onChangeRowsPerPage } =
    useTable();
  const { themeStretch } = useSettingsContext();

  const [openConfirm, setOpenConfirm] = useState(false);
  const [tableData, setTableData] = useState<INguoiDung[]>([]);
  const [dataRow, setDataRow] = useState<INguoiDung | null>(null);
  const [tabs, setTabs] = useState<ITab[]>([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterName, setFilterName] = useState('');
  const [filterPhongDai, setFilterPhongDai] = useState('all');
  const [chiTietQuyenChucVu, setChiTietQuyenChucVu] = useState<IChucVuRow | null>(null);

  const { data, isLoading, isError, isFetching } = useNguoiDungsQuery({
    refetchOnWindowFocus: false,
  });

  // set init data table
  useEffect(() => {
    if (!isLoading && !isError && !isNil(data) && !equal(data, tableData)) {
      const groupData = groupBy(
        data.elements,
        (dt) => dt.nguoiDungKhuVucList.find((kv) => kv.loai === 'CHINH')?.dmPhongDai?.ten || ''
      );
      const pds = Object.keys(groupData);
      const allTab: ITab = {
        value: 'all',
        label: 'Tất cả',
        count: data.elements.length,
        color: 'info',
      };
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

  const handleOpenQuyenChucVuDialog = (chucVu: IChucVuRow | null) => {
    if (chucVu) {
      setChiTietQuyenChucVu(chucVu);
    }
  };

  // dialog
  const [openDialog, setOpen] = React.useState(false);
  const handleOpenSidebar = (row: INguoiDung | null) => {
    setOpen(true);
    setDataRow(row);
  };
  const handleClose = (value: boolean) => {
    setOpen(false);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  return (
    <>
      <Head>
        <title>Quản lý người dùng</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Danh sách người dùng"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Cấu hình phòng đài', href: PATH_SETTING_PD.nguoiDung },
            { name: 'Người dùng' },
          ]}
          action={
            <PermissionWrapper
              module="NGUOI_DUNG"
              action="THEM_MOI"
              hideWhenBlocked
              checkAt="pdChinh"
            >
              <Button
                variant="contained"
                onClick={() => {
                  handleOpenSidebar(null);
                }}
                startIcon={<Iconify icon="eva:plus-fill" />}
              >
                Thêm mới
              </Button>
            </PermissionWrapper>
          }
        />

        <Card>
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

          <NguoiDungTableToolbar
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
                <Table sx={{ minWidth: 650 }} size="medium">
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
                        <NguoiDungTableRow
                          no={row.no}
                          key={row.id}
                          row={row}
                          onEditRow={() => {
                            handleOpenSidebar(row);
                          }}
                          onXemQuyenChucVu={(chucVu: IChucVuRow | null) => {
                            if (chucVu) {
                              handleOpenQuyenChucVuDialog(chucVu);
                            }
                          }}
                        />
                      ))}

                    <TableNoData
                      title={
                        !isFiltered
                          ? 'Dữ liệu người dùng đang trống'
                          : 'Không tìm thấy dữ liệu được tìm kiếm'
                      }
                      isNotFound={dataFiltered.length === 0}
                      haveBtnCreate={
                        !!listPhanQuyenChinh.find(
                          (q) => q.module === 'NGUOI_DUNG' && q.action === 'THEM_MOI'
                        )
                      }
                      handleOpenCreate={() => {
                        handleOpenSidebar(null);
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
            count={dataFiltered.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
          />
        </Card>

        {openDialog && (
          <NguoiDungSidebar
            open={openDialog}
            onClose={handleClose}
            initData={
              dataRow
                ? {
                    id: dataRow.id,
                    email: dataRow.email,
                    gioiTinh: dataRow.gioiTinh,
                    soDienThoai: dataRow.soDienThoai,
                    hoTen: dataRow.hoTen,
                    khuVucList: sortBy(dataRow.nguoiDungKhuVucList, ['loai']),
                    trangThai: dataRow.trangThai,
                  }
                : null
            }
          />
        )}

        {chiTietQuyenChucVu && (
          <XemQuyenNguoiDung
            open
            onClose={() => setChiTietQuyenChucVu(null)}
            selectedChucVu={chiTietQuyenChucVu}
          />
        )}

        <ConfirmDialog
          open={openConfirm}
          onClose={handleCloseConfirm}
          title="Ngừng hoạt động"
          content="Bạn có muốn ngừng hoạt động người dùng này?"
          action={
            <Button variant="contained" color="error">
              Xoá
            </Button>
          }
        />
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
  inputData: INguoiDung[];
  comparator: (a: any, b: any) => number;
  filterName: string;
  filterStatus: string;
  filterPhongDai: string;
}) {
  if (!inputData.length) return [];

  if (filterName) {
    const filterNameTrimSpace = filterName.trimStart().trimEnd();
    inputData = inputData.filter((nd) => {
      let tenFilter = false;
      if (!isNil(nd?.hoTen)) {
        tenFilter = nd.hoTen.toLowerCase().indexOf(filterNameTrimSpace.toLowerCase()) !== -1;
      }
      let emailFilter = false;
      if (!isNil(nd?.email)) {
        emailFilter = nd.email.toLowerCase().indexOf(filterNameTrimSpace.toLowerCase()) !== -1;
      }

      let chucVuFilter = false;
      const mainPd = nd?.nguoiDungKhuVucList.find((kv) => kv.loai === 'CHINH');
      if (!isNil(mainPd)) {
        chucVuFilter =
          mainPd?.chucVu?.ten.toLowerCase().indexOf(filterNameTrimSpace.toLowerCase()) !== -1;
      }

      let sdtFilter = false;
      if (!isNil(nd?.soDienThoai)) {
        sdtFilter = nd.soDienThoai.toLowerCase().indexOf(filterNameTrimSpace.toLowerCase()) !== -1;
      }

      return tenFilter || emailFilter || chucVuFilter || sdtFilter;
    });
  }

  if (filterPhongDai !== 'all') {
    inputData = inputData.filter(
      (nd) =>
        nd.nguoiDungKhuVucList.find((kv) => kv.loai === 'CHINH')?.dmPhongDai?.ten === filterPhongDai
    );
  }

  if (filterStatus !== '') {
    inputData = inputData.filter((cv) => {
      if (filterStatus === DANG_HOAT_DONG && cv.trangThai === 'HOAT_DONG') return true;
      if (filterStatus === NGUNG_HOAT_DONG && cv.trangThai === 'NGUNG_HOAT_DONG') return true;
      return false;
    });
  }

  return inputData;
}
