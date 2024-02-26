import { Card, Container, Table, TableBody, TableContainer } from '@mui/material';
import equal from 'fast-deep-equal';
import isNil from 'lodash/isNil';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { IHead } from 'src/@types/common';
import { IThongBao } from 'src/@types/thongbao';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/CustomBreadcrumbs';
import Scrollbar from 'src/components/scrollbar/Scrollbar';
import { useSettingsContext } from 'src/components/settings';
import {
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableSkeleton,
  useTable,
} from 'src/components/table';
import { TABLE_HEAD_THONG_BAO } from 'src/constants/thongbao.constant';
import { useThongBaosQuery } from 'src/data/thongbao';
import DashboardLayout from 'src/layouts/dashboard/DashboardLayout';
import { PATH_DASHBOARD } from 'src/routes/paths';
import ThongBaoTableRow from 'src/sections/thongbao/ThongBaoTableRow';
import ThongBaoTableToolbar from 'src/sections/thongbao/ThongBaoTableToolbar';

// ----------------------------------------------------------------------
ThongBaoPage.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

export default function ThongBaoPage() {
  const { themeStretch } = useSettingsContext();
  const { dense, page, setPage, rowsPerPage, onChangePage, onChangeRowsPerPage, onChangeDense } =
    useTable();
  const [headerTable, setHeaderTable] = useState<IHead[]>(TABLE_HEAD_THONG_BAO);
  const [tableData, setTableData] = useState<IThongBao[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterModule, setFilterModule] = useState<string>('');
  const { data, isLoading, isError, isFetching } = useThongBaosQuery(
    {
      size: rowsPerPage,
      page,
      trangThai: filterStatus,
      module: filterModule,
    },
    { refetchOnWindowFocus: false }
  );
  useEffect(() => {
    if (!isLoading && !isError && !isNil(data?.elements) && !equal(data?.elements, tableData)) {
      if (data?.elements) {
        setTableData(data.elements);
      }
    }
  }, [isLoading, isError, data, tableData]);
  const isFiltered = filterStatus !== '' || filterModule !== '';
  const isNotFound = !tableData.length && isFiltered;
  const dataEmpty = !tableData.length && filterStatus === '' && filterModule === '';
  const handleResetFilter = () => {
    setFilterStatus('');
    setFilterModule('');
  };

  const handleFilterStatus = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(0);
    setFilterStatus(event.target.value);
  };
  const handleFilterModule = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(0);
    setFilterModule(event.target.value);
  };
  return (
    <>
      <Head>
        <title>Thông Báo</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Danh sách thông báo"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Danh sách thông báo' },
          ]}
        />

        <Card sx={{ mb: 5 }}>
          <ThongBaoTableToolbar
            isFiltered={isFiltered}
            filterStatus={filterStatus}
            filterModule={filterModule}
            onFilterStatus={handleFilterStatus}
            onFilterModule={handleFilterModule}
            onResetFilter={handleResetFilter}
          />
          {!isFetching ? (
            <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
              <Scrollbar>
                <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                  <TableHeadCustom headLabel={headerTable} isNumIndex />
                  <TableBody>
                    {tableData.map((row, index) => (
                      <ThongBaoTableRow headLabel={headerTable} no={index} key={row.id} row={row} />
                    ))}

                    <TableNoData
                      title={
                        !isFiltered
                          ? 'Dữ liệu thông báo đang trống'
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
        </Card>
      </Container>
    </>
  );
}
