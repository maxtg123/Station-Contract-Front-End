// next
import { Card, Container, Stack, Table, TableBody, TableContainer } from '@mui/material';
import equal from 'fast-deep-equal';
import isNil from 'lodash/isNil';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { IActivityLog } from 'src/@types/activityLog';
import { IHead } from 'src/@types/common';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/CustomBreadcrumbs';
import { useDateRangePicker } from 'src/components/date-range-picker';
import DateRangePicker from 'src/components/date-range-picker/DateRangePicker';
import Iconify from 'src/components/iconify/Iconify';
import Scrollbar from 'src/components/scrollbar/Scrollbar';
import { useSettingsContext } from 'src/components/settings';
import {
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableSkeleton,
  useTable,
} from 'src/components/table';
import { TABLE_HEAD_ACTIVITY_LOG } from 'src/constants/activityLog.constant';
import { useActivityLogQuery } from 'src/data/activityLog';
import DashboardLayout from 'src/layouts/dashboard/DashboardLayout';
import { PATH_DASHBOARD } from 'src/routes/paths';
import ActivityLogTableRow from 'src/sections/activity-log/ActivityLogTableRow';
import ActivityLogTableToolbar from 'src/sections/activity-log/ActivityLogTableToolbar';
import { FileFilterButton } from 'src/sections/file';

// ----------------------------------------------------------------------

ActivityLogPage.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function ActivityLogPage() {
  const { themeStretch } = useSettingsContext();
  const { dense, page, setPage, rowsPerPage, onChangePage, onChangeRowsPerPage, onChangeDense } =
    useTable({ defaultRowsPerPage: 10 });
  const [headerTable, setHeaderTable] = useState<IHead[]>(TABLE_HEAD_ACTIVITY_LOG);
  const [tableData, setTableData] = useState<IActivityLog[]>([]);
  const [filterModule, setFilterModule] = useState<string>('');

  const {
    startDate,
    endDate,
    onChangeStartDate,
    onChangeEndDate,
    open: openPicker,
    onOpen: onOpenPicker,
    onClose: onClosePicker,
    onReset: onResetPicker,
    isSelected: isSelectedValuePicker,
    isError: isError1,
    shortLabel,
  } = useDateRangePicker(null, null);

  const handleChangeStartDate = (newValue: Date | null) => {
    onChangeStartDate(newValue);
  };

  const handleChangeEndDate = (newValue: Date | null) => {
    onChangeEndDate(newValue);
  };

  const { data, isLoading, isError } = useActivityLogQuery(
    {
      size: rowsPerPage,
      page,
      module: filterModule,
      from: startDate,
      to: endDate,
    },
    { refetchOnWindowFocus: false }
  );
  useEffect(() => {
    if (
      !isLoading &&
      !isError &&
      !isError1 &&
      !isNil(data?.elements) &&
      !equal(data?.elements, tableData)
    ) {
      if (data?.elements) {
        setTableData(data.elements);
      }
    }
  }, [isLoading, isError, isError1, data, tableData]);
  const isFiltered = filterModule !== '' || !!startDate || !!endDate
  
  const isNotFound = !tableData.length && isFiltered;
  const dataEmpty = !tableData.length && filterModule === '' && !startDate && !endDate;
  const handleResetFilter = () => {
    setFilterModule('');
    if (onResetPicker) {
      onResetPicker();
    }
  };

  const handleFilterModule = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(0);
    setFilterModule(event.target.value);
  };
  return (
    <>
      <Head>
        <title>Activity Log</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Activity Log"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Activity Log' }]}
        />

        <Card sx={{ mb: 5 }}>
          <Stack
            spacing={2}
            alignItems="center"
            direction={{
              xs: 'column',
              sm: 'row',
            }}
            sx={{ px: 2.5, py: 3 }}
          >
            <>
              <FileFilterButton
                isSelected={!!isSelectedValuePicker}
                startIcon={<Iconify icon="eva:calendar-fill" />}
                onClick={onOpenPicker}
              >
                {isSelectedValuePicker ? shortLabel : 'Chọn ngày'}
              </FileFilterButton>

              <DateRangePicker
                variant="calendar"
                startDate={startDate}
                endDate={endDate}
                onChangeStartDate={handleChangeStartDate}
                onChangeEndDate={handleChangeEndDate}
                open={openPicker}
                onClose={onClosePicker}
                isSelected={isSelectedValuePicker}
                isError={isError1}
              />
            </>
            <ActivityLogTableToolbar
              isFiltered={isFiltered}
              filterModule={filterModule}
              onFilterModule={handleFilterModule}
              onResetFilter={handleResetFilter}
            />
          </Stack>

          {!isLoading ? (
            <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
              <Scrollbar>
                <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                  <TableHeadCustom headLabel={headerTable} />
                  <TableBody>
                    {tableData.map((row, index) => (
                      <ActivityLogTableRow
                        headLabel={headerTable}
                        no={index + 1}
                        key={row.id}
                        row={row}
                      />
                    ))}
                    <TableNoData
                      title={
                        !isFiltered
                          ? 'Dữ liệu Activity log đang trống'
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
