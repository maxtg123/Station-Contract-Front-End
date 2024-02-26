import {
  Box,
  Button,
  Card,
  Container,
  Divider,
  Stack,
  Table,
  TableBody,
  TableContainer,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { startOfDay } from 'date-fns';
import equal from 'fast-deep-equal';
import debounce from 'lodash/debounce';
import isNil from 'lodash/isNil';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { IListTramByHopDong } from 'src/@types/thanhtoan';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/CustomBreadcrumbs';
import Iconify from 'src/components/iconify/Iconify';
import Scrollbar from 'src/components/scrollbar/Scrollbar';
import { useSettingsContext } from 'src/components/settings';
import {
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableSelectedAction,
  TableSkeleton,
} from 'src/components/table';
import { TABLE_HEAD_HOP_DONG_THANH_TOAN } from 'src/constants/thanhtoan.constant';
import { useHopDongFilterContext } from 'src/context/hop-dong-mat-bang/hopDongFilterContext';
import { useHopDongQuery } from 'src/data/hopDongMatBang';

import dynamic from 'next/dynamic';
import { IKeyValuePair } from 'src/@types/common';
import { IHopDong } from 'src/@types/hopdongmatbang';
import { CustomChip } from 'src/components/custom-chip';
import { SearchTotalResult } from 'src/components/search-not-found';
import useTablePagination from 'src/components/table/useTablePagination';
import { defaultObjectFilterHopDong } from 'src/constants/hopdong.constant';
import { HEAD_HOP_DONG_TRAM_LIST } from 'src/constants/hopdongmatbang.constant';
import { PATH_DASHBOARD, PATH_HOP_DONG_MAT_BANG } from 'src/routes/paths';
import { fDate } from 'src/utils/formatTime';
import { removeDuplicatesHopDong } from 'src/utils/hopDongUtils';
import ThanhToanAnalytic from './ThanhToanAnalytic';
import ThanhToanTableRow from './ThanhToanTableRow';
import ThanhToanTableToolbar from './ThanhToanTableToolbar';
import TienHanhThanhToanDialog from './thanh-toan-model/TienHanhThanhToanDialog';

const FilterAdvancedHopDong = dynamic(() => import('../FilterAdvancedHopDong'));
const ExportHopDongDialog = dynamic(
  () => import('../../components/hop-dong/export/ChooseFieldsExportHopDong')
);

const CHUA_THANH_TOAN = 'CHUA_THANH_TOAN';
export default function ThanhToanContainer() {
  const theme = useTheme();
  const { themeStretch } = useSettingsContext();
  const {
    state: { filterHopDongFields, filterFormFields },
    dispatch,
  } = useHopDongFilterContext();
  const [tableData, setTableData] = useState<IHopDong[]>([]);
  const {
    dense,
    page,
    rowsPerPage,
    setPage,
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    onChangePage,
    onChangeRowsPerPage,
    onChangeDense,
  } = useTablePagination<IHopDong>({
    tableData,
  });
  const [openThanhToan, setOpenThanhToan] = useState(false);

  const [filterName, setFilterName] = useState<string>('');

  const [filterEndDate, setFilterEndDate] = useState<Date | null>(null);

  const [filterStartDate, setFilterStartDate] = useState<Date | null>(null);

  const [openFilterAdvanced, setOpenFilterAdvanced] = useState(false);

  const [openExportHopDong, setOpenExportHopDong] = useState(false);

  const [listChipFilter, setListChipFilter] = useState<IKeyValuePair[]>([]);

  const [selectedTramByContract, setSelectedTramByContract] = useState<IListTramByHopDong[]>([]);

  const [saveDataSeleted, setSaveDataSeleted] = useState<IHopDong[]>([]);

  const { data, isLoading, isError, isFetching } = useHopDongQuery(
    {
      size: rowsPerPage,
      page,
      loaiHopDong: 'MAT_BANG',
      trangThaiHopDong: 'HOAT_DONG',
      trangThaiThanhToan: CHUA_THANH_TOAN,
      ...(filterName && { search: filterName.trimStart().trimEnd() }),
      ...filterHopDongFields,
    },
    {
      refetchOnWindowFocus: false,
    }
  );
  // const { data: dataThongKeHopDOngThanhToan } = useThongKeHopDongThanhToanQuery(
  //   {},
  //   {
  //     refetchOnWindowFocus: false,
  //   }
  // );

  useEffect(() => {
    if (!isLoading && !isError && !isNil(data?.elements) && !equal(data?.elements, tableData)) {
      if (data?.elements) {
        setTableData(data.elements);
      }
    }
  }, [isLoading, isError, data, tableData]);
  useEffect(() => {
    if (selected.length > 0) {
      const currentFilter =
        data?.elements?.filter((dt) => selected.includes(dt.id.toString())) || [];
      if (saveDataSeleted.length > 0) {
        const temp = currentFilter
          .concat(saveDataSeleted)
          .filter((dt) => selected.includes(dt.id.toString()));
        const result = removeDuplicatesHopDong(temp);
        setSaveDataSeleted(result);
      } else {
        setSaveDataSeleted(currentFilter);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, data]);
  useEffect(() => {
    setSelected([]);
    const arr: IKeyValuePair[] = Object.entries(filterFormFields)
      .map(([key, value]) => ({
        key,
        value,
      }))
      .filter(({ value }) => value !== null && value !== '' && value !== undefined);
    setListChipFilter(arr);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterFormFields]);

  const filteHopDongMatBangContext =
    filterHopDongFields.from !== null ||
    filterHopDongFields.to !== null ||
    filterHopDongFields.maTram !== null ||
    filterHopDongFields.soHopDong !== '' ||
    filterHopDongFields.soHopDongErp !== '' ||
    filterHopDongFields.ngayKyFrom !== null ||
    filterHopDongFields.ngayKyTo !== null ||
    filterHopDongFields.ngayKetThucFrom !== null ||
    filterHopDongFields.ngayKetThucTo !== null ||
    filterHopDongFields.hinhThucDauTuId !== null ||
    filterHopDongFields.hinhThucKyHopDongId !== null ||
    filterHopDongFields.doiTuongKyHopDongId !== null ||
    filterHopDongFields.tinhTrangThanhToan !== '' ||
    filterHopDongFields.idTinh !== null ||
    filterHopDongFields.idHuyen !== null ||
    filterHopDongFields.idXa !== null ||
    filterHopDongFields.phongDaiId !== null ||
    filterHopDongFields.tinhTrangThanhToan !== '';
  const isFiltered =
    filterName !== '' ||
    filterStartDate !== null ||
    filterEndDate !== null ||
    filteHopDongMatBangContext;
  const isNotFound = !tableData.length && isFiltered;
  const handleFilterName = debounce((event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(0);
    setFilterName(event.target.value);
  }, 500);
  // Filter advanced hợp đồng
  const handleOpenFilterAdvanced = () => {
    setOpenFilterAdvanced(true);
  };
  const handleCloseFilterAdvanced = () => {
    setOpenFilterAdvanced(false);
  };

  // Export hop dong
  const handleOpenExportHopDong = () => {
    setOpenExportHopDong(true);
  };
  const handleCloseExportHopDong = () => {
    setOpenExportHopDong(false);
  };
  const handleOpenThanhToan = () => {
    setOpenThanhToan(true);
  };
  const handleCloseThanhToan = () => {
    setOpenThanhToan(false);
  };

  const handleDeletedMultiFilter = (value: IKeyValuePair) => {
    const temp = listChipFilter.filter((item) => item.value !== value.value);
    setListChipFilter(temp);
    if (value.key === 'idTinh') {
      dispatch({
        type: 'set-form-filter',
        payload: {
          ...filterFormFields,
          [value.key as string]: defaultObjectFilterHopDong[value.key],
          idHuyen: null,
          idXa: null,
        },
      });
    } else if (value.key === 'idHuyen') {
      dispatch({
        type: 'set-form-filter',
        payload: {
          ...filterFormFields,
          [value.key as string]: defaultObjectFilterHopDong[value.key],
          idXa: null,
        },
      });
    } else {
      dispatch({
        type: 'set-form-filter',
        payload: {
          ...filterFormFields,
          [value.key as string]: defaultObjectFilterHopDong[value.key],
        },
      });
    }
  };

  const handleRefreshFilter = () => {
    setFilterName('');
    setFilterEndDate(null);
    setFilterStartDate(null);
    dispatch({ type: 'reset-form-filter' });
  };
  const handleSelectTram = (contractId: string, tramId: string[]) => {
    setSelectedTramByContract((prevSelected) => {
      // Tìm kiếm nếu đã có hopDongId trong state
      const existingContract = prevSelected.find((item) => item.hopDongId === contractId);

      // Nếu đã có, cập nhật listTramId
      if (existingContract) {
        return prevSelected.map((item) =>
          item.hopDongId === contractId ? { ...item, listTramId: tramId } : item
        );
      }

      // Nếu chưa có, thêm mới vào state
      return [...prevSelected, { hopDongId: contractId, listTramId: tramId }];
    });
  };
  return (
    <>
      <Head>
        <title>Hợp đồng mặt bằng | Thanh toán</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Danh sách hợp đồng cần thanh toán"
          links={[
            { name: 'Quản lý hợp đồng nhà trạm', href: PATH_DASHBOARD.root },
            { name: 'Hợp đồng mặt bằng', href: PATH_HOP_DONG_MAT_BANG.root },
            { name: 'Thanh toán' },
          ]}
        />
        <Card sx={{ mb: 5 }}>
          <Scrollbar>
            <Stack
              direction="row"
              divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
              sx={{ py: 2 }}
            >
              <ThanhToanAnalytic
                title="Sắp đến kỳ thanh toán"
                total={0}
                percent={100}
                icon="ic:round-receipt"
                color={theme.palette.info.main}
              />
              <ThanhToanAnalytic
                title="Cần thanh toán"
                total={0}
                icon="eva:clock-fill"
                color={theme.palette.warning.main}
              />
              <ThanhToanAnalytic
                title="Quá hạn thanh toán"
                total={0}
                icon="eva:close-circle-fill"
                color={theme.palette.error.main}
              />
            </Stack>
          </Scrollbar>
        </Card>
        <Card>
          <ThanhToanTableToolbar
            isNotFound={isNotFound}
            filterName={filterName}
            onFilterName={handleFilterName}
            filterStartDate={filterStartDate}
            filterEndDate={filterEndDate}
            onFilterAdvanced={handleOpenFilterAdvanced}
            onExport={handleOpenExportHopDong}
            onFilterStartDate={(newValue) => {
              if (newValue) {
                setFilterStartDate(startOfDay(newValue));
              } else {
                setFilterStartDate(null);
              }
            }}
            onFilterEndDate={(newValue) => {
              if (newValue) {
                setFilterEndDate(startOfDay(newValue));
              } else {
                setFilterEndDate(null);
              }
            }}
          />
          <Box sx={{ marginX: 3, marginBottom: 2 }}>
            {isFiltered && <SearchTotalResult total={data?.metadata?.total || 0} />}
            <Stack direction="row" flexWrap="wrap" gap={1} alignItems="center">
              {listChipFilter.length > 0 &&
                listChipFilter.map((item) => (
                  <CustomChip
                    key={item.key}
                    title={item.key}
                    data={[
                      {
                        key: item.key,
                        label: `${
                          // eslint-disable-next-line no-nested-ternary
                          typeof item.value === 'object'
                            ? item.value?.ten
                              ? item.value?.ten
                              : fDate(new Date(item.value as any))
                            : item.value
                        }`,
                      },
                    ]}
                    onDeletedChipMultiFilter={() => handleDeletedMultiFilter(item)}
                  />
                ))}
              {isFiltered && (
                <Button
                  color="error"
                  sx={{ flexShrink: 0 }}
                  onClick={handleRefreshFilter}
                  size="small"
                  startIcon={<Iconify icon="eva:refresh-outline" />}
                >
                  Làm mới
                </Button>
              )}
            </Stack>
          </Box>
          {!isFetching ? (
            <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
              <TableSelectedAction
                dense={dense}
                numSelected={selected.length}
                rowCount={data?.elements ? data.metadata.total : 0}
                onSelectAllRows={() => onSelectAllRows()}
                action={
                  <Button
                    onClick={handleOpenThanhToan}
                    variant="contained"
                    startIcon={<Iconify icon="eva:checkmark-circle-outline" />}
                  >
                    Tiến hành thanh toán
                  </Button>
                }
                sx={{ position: 'relative' }}
              />
              <Scrollbar>
                <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                  <TableHeadCustom
                    headLabel={TABLE_HEAD_HOP_DONG_THANH_TOAN}
                    rowCount={data?.elements ? data.metadata.total : 0}
                    numSelected={selected.length}
                    totalCurrentOnPage={tableData.length}
                    onSelectAllRows={() => onSelectAllRows()}
                    isStickyActionHead
                    isCheckedTablePagination
                  />
                  <TableBody>
                    {tableData.map((row, index) => (
                      <ThanhToanTableRow
                        no={index}
                        key={row.id + row.id.toString()}
                        row={row}
                        selected={selected.includes(row.id.toString())}
                        onSelectRow={() => onSelectRow(row.id.toString())}
                        headLabel={TABLE_HEAD_HOP_DONG_THANH_TOAN}
                        onSelectedTram={handleSelectTram}
                      />
                    ))}

                    <TableNoData
                      title={
                        !isFiltered
                          ? 'Dữ liệu hợp đồng thanh toán đang trống'
                          : 'Không tìm thấy dữ liệu được tìm kiếm'
                      }
                      isNotFound={isNotFound}
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
      {openThanhToan && (
        <TienHanhThanhToanDialog
          data={saveDataSeleted ?? []}
          selectedTramByContract={selectedTramByContract}
          title="Thanh toán"
          subtitle="Danh sách hợp đồng cần thanh toán"
          open={openThanhToan}
          onClose={() => handleCloseThanhToan()}
          onResetSelectedAllRows={() => {}}
        />
      )}
      {openFilterAdvanced && (
        <FilterAdvancedHopDong
          open={openFilterAdvanced}
          onClose={() => handleCloseFilterAdvanced()}
          title="Lọc dữ liệu danh sách thanh toán  hợp đồng"
        />
      )}
      {openExportHopDong && (
        <ExportHopDongDialog
          open={openExportHopDong}
          onClose={handleCloseExportHopDong}
          headLabel={TABLE_HEAD_HOP_DONG_THANH_TOAN.concat(HEAD_HOP_DONG_TRAM_LIST).filter(
            (item) => item.id !== 'createdAt' && item.id !== 'updatedAt'
          )}
          loaiHopDong="MAT_BANG"
          trangThaiHopDong="HOAT_DONG"
          selectRows={selected}
          filterAdvanced={filterHopDongFields}
          filterName={filterName}
        />
      )}
    </>
  );
}
