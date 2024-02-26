import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Card,
  Container,
  Divider,
  Fab,
  MenuItem,
  Stack,
  Tab,
  Table,
  TableBody,
  TableContainer,
  Tabs,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import equal from 'fast-deep-equal';
import { saveAs } from 'file-saver';
import debounce from 'lodash/debounce';
import isNil from 'lodash/isNil';
import isNull from 'lodash/isNull';
import isUndefined from 'lodash/isUndefined';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { IHead, IKeyValuePair } from 'src/@types/common';
import { ITram } from 'src/@types/tram';
import ConfirmDialog from 'src/components/confirm-dialog/ConfirmDialog';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/CustomBreadcrumbs';
import { CustomChip } from 'src/components/custom-chip';
import Iconify from 'src/components/iconify/Iconify';
import Label from 'src/components/label/Label';
import MenuPopover from 'src/components/menu-popover/MenuPopover';
import PermissionBgProcessWrapper from 'src/components/permission-bg-process-wrapper';
import PermissionWrapper from 'src/components/permission-wrapper';
import Scrollbar from 'src/components/scrollbar/Scrollbar';
import { SearchTotalResult } from 'src/components/search-not-found';
import { useSettingsContext } from 'src/components/settings';
import {
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableSelectedAction,
  TableSkeleton,
} from 'src/components/table';
import useTablePagination from 'src/components/table/useTablePagination';
import {
  tienTrinhAction,
  tienTrinhMessage,
  tienTrinhModule,
} from 'src/constants/tientrinh.constant';
import { DRAG_TRAM_COL, TABLE_HEAD, defaultObjectFilterTram } from 'src/constants/tram.constant';
import { useTienTrinhContext } from 'src/context/tien-trinh/TienTrinhContext';
import { CreateTramProvider } from 'src/context/tram/createTramContext';
import { ITabTramTable, useTramFilterContext } from 'src/context/tram/tramFilterContext';
import {
  useExportTramMutation,
  useSyncTramFromPTM,
  useThongKeTramQuery,
  useTramsQuery,
} from 'src/data/tram';
import { PATH_DASHBOARD } from 'src/routes/paths';
import DragColumnTable from 'src/sections/tram/DragColumnTable';
import FilterAdvanced from 'src/sections/tram/FilterAdvanced';
import TramCreate from 'src/sections/tram/TramCreate';
import TramTableRow from 'src/sections/tram/TramTableRow';
import TramTableToolbar from 'src/sections/tram/TramTableToolbar';
import { addBgProcess } from 'src/utils/bgProcessLocalStorage';
import TramAnalytic from './TramAnalytic';

const ChooseFieldsExportDialog = dynamic(
  () => import('src/sections/tram/ChooseFieldsExportDialog'),
  { ssr: false }
);

const TramContainer = () => {
  const theme = useTheme();
  const { themeStretch } = useSettingsContext();
  const {
    state: { filterTramFields, activeTab, filterFormFields },
    dispatch,
  } = useTramFilterContext();
  const {
    state: { tienTrinh },
    dispatch: dispatchTienTrinh,
  } = useTienTrinhContext();
  const { enqueueSnackbar } = useSnackbar();

  const storedData = localStorage.getItem(DRAG_TRAM_COL);
  const initialHeaderTable = storedData ? JSON.parse(storedData) : TABLE_HEAD;
  const [headerTable, setHeaderTable] = useState<IHead[]>(initialHeaderTable);
  const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);
  const [tableData, setTableData] = useState<ITram[]>([]);
  const {
    dense,
    page,
    rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onChangePage,
    onChangeRowsPerPage,
    onChangeDense,
  } = useTablePagination<ITram>({ tableData });
  const [dataRow, setDataRow] = useState<ITram | null>(null);
  const [filterName, setFilterName] = useState<string>('');
  const [openExportDialog, setOpenExportDialog] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [openDragColumTable, setOpenDragColumnTable] = useState(false);
  const [openFilterAdvanced, setOpenFilterAdvanced] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [idTienTrinh, setIdTienTrinh] = useState<number | null>(null);
  const [listChipFilter, setListChipFilter] = useState<IKeyValuePair[]>([]);
  const { data, isLoading, isError, refetch, isFetching } = useTramsQuery(
    {
      size: rowsPerPage,
      page,
      ...(filterName && { search: filterName.trimStart().trimEnd() }),
      ...(activeTab !== 'all' && {
        trangThaiPhatSong: activeTab === 'da_phat_song',
      }),
      ...filterTramFields,
    },
    { refetchOnWindowFocus: false }
  );
  const { data: dataThongKeTram } = useThongKeTramQuery({ refetchOnWindowFocus: false });
  const { mutate: exportAllField, isLoading: exporting } = useExportTramMutation();
  const { mutate: syncTramFromPTM } = useSyncTramFromPTM();

  useEffect(() => {
    if (!isLoading && !isError && !isNil(data?.elements) && !equal(data?.elements, tableData)) {
      if (data?.elements) {
        setTableData(data.elements);
      }
    }
  }, [isLoading, isError, data, tableData]);

  const TABS = [
    { value: 'all', label: 'All', color: 'info', count: dataThongKeTram?.TAT_CA || 0 },
    {
      value: 'da_phat_song',
      label: 'Đã phát sóng',
      color: 'success',
      count:
        (dataThongKeTram?.PHAT_SONG_HOAT_DONG || 0) +
        (dataThongKeTram?.PHAT_SONG_NGUNG_HOAT_DONG || 0),
    },
    {
      value: 'chua_phat_song',
      label: 'Trạm phát triển mạng',
      color: 'warning',
      count:
        (dataThongKeTram?.CHUA_PHAT_SONG_HOAT_DONG || 0) +
        (dataThongKeTram?.CHUA_PHAT_SONG_NGUNG_HOAT_DONG || 0),
    },
  ] as const;

  const isFiltered =
    filterName !== '' ||
    filterTramFields.huyen !== null ||
    filterTramFields.loaiCsht !== null ||
    filterTramFields.phongDai !== null ||
    filterTramFields.tinh !== null ||
    filterTramFields.to !== null ||
    filterTramFields.trangThaiHoatDong !== '' ||
    filterTramFields.xa !== null;
  const isNotFound = !tableData.length && isFiltered;
  const dataEmpty = !tableData.length && filterName === '';

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleClickOpenCreate = () => {
    setOpenCreate(true);
  };

  const handleCloseCreate = () => {
    setDataRow(null);
    setOpenCreate(false);
    handleCloseConfirm();
  };

  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };
  const handleFilterName = debounce((event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(0);
    setFilterName(event.target.value);
  }, 500);

  const handleResetFilter = () => {
    setFilterName('');
  };
  const handleOpenExportDialog = () => {
    setOpenExportDialog(true);
  };
  const handleEditRow = (row: ITram) => {
    setDataRow(row);
    setOpenCreate(true);
  };
  // Drag column trạm
  const handleOpenDragColumnTable = () => {
    setOpenDragColumnTable(true);
  };
  const handleCloseDragColumnTable = () => {
    setOpenDragColumnTable(false);
  };
  const handleChangeDragColumn = (value: IHead[]) => {
    setHeaderTable(value);
  };

  // Filter advanced trạm
  const handleOpenFilterAdvanced = () => {
    setOpenFilterAdvanced(true);
  };
  const handleCloseFilterAdvanced = () => {
    setOpenFilterAdvanced(false);
  };
  useEffect(() => {
    if (!isNull(tienTrinh.id) && !isNull(idTienTrinh) && tienTrinh.id === idTienTrinh) {
      if (tienTrinh.status === 'success') {
        enqueueSnackbar(`${tienTrinh.hoanThanh}/${tienTrinh.tongSo} trạm được đồng bộ`, {
          variant: 'success',
          persist: false,
        });
      } else {
        enqueueSnackbar(`${tienTrinh.soLuongLoi}/${tienTrinh.tongSo} trạm đồng bộ thất bại`, {
          variant: 'error',
          persist: false,
        });
      }
      refetch();
      dispatchTienTrinh({ type: 'reset-tien-trinh' });
    }
  }, [
    dispatchTienTrinh,
    enqueueSnackbar,
    idTienTrinh,
    refetch,
    tienTrinh.hoanThanh,
    tienTrinh.id,
    tienTrinh.soLuongLoi,
    tienTrinh.status,
    tienTrinh.tongSo,
  ]);
  useEffect(() => {
    const arr: IKeyValuePair[] = Object.entries(filterFormFields)
      .map(([key, value]) => ({
        key,
        value,
      }))
      .filter(({ value }) => value !== null && value !== '' && value !== undefined);
    setListChipFilter(arr);
  }, [filterFormFields]);
  if (isUndefined(dataThongKeTram)) {
    return null;
  }
  const handleChangeTab = (tab: ITabTramTable) => {
    setSelected([]);
    setPage(0);
    dispatch({ type: 'set-active-tab-table', payload: tab });
  };
  const handleExportAllFields = () => {
    const newData = {
      export_all_column: true,
      listId: selected,
    };
    exportAllField(newData, {
      onSuccess: (res, variables, context) => {
        const contentDisposition = res.headers['content-disposition'];
        let fileName = 'Trạm.xlsx';
        if (contentDisposition) {
          const matches = contentDisposition.match(/filename=([^;]+)/);
          fileName = matches && matches.length > 1 ? matches[1] : 'file';
        }
        saveAs(res.data, fileName);
      },
    });
  };

  const handleSyncTramFromPTM = () => {
    syncTramFromPTM(undefined, {
      onSuccess(res) {
        const resIdImport = res.data;
        if (resIdImport)
          addBgProcess({
            id: resIdImport,
            module: tienTrinhModule.TRAM,
            action: tienTrinhAction.TRAM.SYNCHRONIZED,
            messageSuccess: tienTrinhMessage.TRAM.SYNCHRONIZED.SUCCESS,
            messageError: tienTrinhMessage.TRAM.SYNCHRONIZED.ERROR,
            messageLoading: tienTrinhMessage.TRAM.SYNCHRONIZED.LOADING,
          });
        setIdTienTrinh(resIdImport);
      },
      onError(error, variables, context) {
        console.log(error);
      },
    });
  };
  const handleDeletedChipTab = () => {
    dispatch({ type: 'set-active-tab-table', payload: 'all' });
  };
  const handleDeletedMultiFilter = (value: IKeyValuePair) => {
    const temp = listChipFilter.filter((item) => item.value !== value.value);
    setListChipFilter(temp);
    if (value.key === 'tinh') {
      dispatch({
        type: 'set-form-filter',
        payload: {
          ...filterFormFields,
          [value.key as string]: defaultObjectFilterTram[value.key],
          huyen: null,
          xa: null,
        },
      });
    } else if (value.key === 'huyen') {
      dispatch({
        type: 'set-form-filter',
        payload: {
          ...filterFormFields,
          [value.key as string]: defaultObjectFilterTram[value.key],
          xa: null,
        },
      });
    } else if (value.key === 'phongDai') {
      dispatch({
        type: 'set-form-filter',
        payload: {
          ...filterFormFields,
          [value.key as string]: defaultObjectFilterTram[value.key],
          to: null,
        },
      });
    } else {
      dispatch({
        type: 'set-form-filter',
        payload: {
          ...filterFormFields,
          [value.key as string]: defaultObjectFilterTram[value.key],
        },
      });
    }
  };
  const handleRefreshFilter = () => {
    handleResetFilter();
    dispatch({ type: 'set-active-tab-table', payload: 'all' });
    dispatch({ type: 'reset-form-filter' });
  };
  return (
    <>
      <Head>
        <title>Trạm</title>
      </Head>
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Danh sách trạm"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Danh sách trạm' }]}
          action={
            <PermissionWrapper module="TRAM" action="THEM_MOI" hideWhenBlocked checkAt="atLeastPD">
              <Fab sx={{ width: '40px', height: '40px' }} onClick={handleOpenPopover}>
                <Iconify icon="eva:plus-fill" />
              </Fab>
            </PermissionWrapper>
          }
        />
        <Card sx={{ mb: 5 }}>
          <Scrollbar>
            <Stack
              direction="row"
              divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
              sx={{ py: 2 }}
            >
              <TramAnalytic
                title="Tổng trạm hiện hữu"
                total={dataThongKeTram.HOAT_DONG}
                percent={100}
                icon="ic:round-receipt"
                color={theme.palette.info.main}
              />

              <TramAnalytic
                title="Đã phát sóng"
                total={dataThongKeTram.PHAT_SONG_HOAT_DONG}
                percent={(dataThongKeTram.PHAT_SONG_HOAT_DONG / dataThongKeTram.HOAT_DONG) * 100}
                icon="eva:checkmark-circle-2-fill"
                color={theme.palette.success.main}
              />

              <TramAnalytic
                title="Chưa phát sóng"
                total={dataThongKeTram.CHUA_PHAT_SONG_HOAT_DONG}
                percent={
                  (dataThongKeTram.CHUA_PHAT_SONG_HOAT_DONG / dataThongKeTram.HOAT_DONG) * 100
                }
                icon="eva:clock-fill"
                color={theme.palette.warning.main}
              />
            </Stack>
          </Scrollbar>
        </Card>
        <Card>
          <Tabs
            value={activeTab}
            onChange={(event, newValue) => handleChangeTab(newValue)}
            sx={{
              px: 2,
              bgcolor: 'background.neutral',
            }}
          >
            {TABS.map((tab) => (
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
          <TramTableToolbar
            filterName={filterName}
            onFilterName={handleFilterName}
            onDragColumnTable={handleOpenDragColumnTable}
            onFilterAdvanced={handleOpenFilterAdvanced}
          />
          <Box sx={{ marginX: 3, marginBottom: 2 }}>
            {isFiltered && <SearchTotalResult total={data?.metadata?.total || 0} />}
            <Stack direction="row" flexWrap="wrap" gap={1} alignItems="center">
              {activeTab !== 'all' && (
                <CustomChip
                  title="Trạng thái"
                  data={[{ key: activeTab, label: `${activeTab}` }]}
                  onDeletedChipTab={handleDeletedChipTab}
                />
              )}
              {listChipFilter.length > 0 &&
                listChipFilter.map((item) => (
                  <CustomChip
                    key={item.key}
                    title={item.key}
                    data={[
                      {
                        key: item.key,
                        label: `${typeof item.value === 'object' ? item.value?.ten : item.value}`,
                      },
                    ]}
                    onDeletedChipMultiFilter={() => handleDeletedMultiFilter(item)}
                  />
                ))}
              {(isFiltered || activeTab !== 'all') && (
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
                  <Stack direction="row" spacing={2}>
                    <LoadingButton
                      startIcon={<Iconify icon="eva:download-fill" />}
                      onClick={handleExportAllFields}
                      variant="contained"
                      loading={exporting}
                    >
                      Xuất tất cả trường dữ liệu
                    </LoadingButton>
                    <Button
                      startIcon={<Iconify icon="eva:download-fill" />}
                      onClick={handleOpenExportDialog}
                      variant="contained"
                    >
                      Chọn trường để xuất
                    </Button>
                  </Stack>
                }
                sx={{ position: 'relative' }}
              />
              <Scrollbar>
                <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                  <TableHeadCustom
                    headLabel={headerTable.filter((item) => item.checked === true)}
                    rowCount={data?.elements ? data.metadata.total : 0}
                    numSelected={selected.length}
                    totalCurrentOnPage={tableData.length}
                    onSelectAllRows={() => onSelectAllRows()}
                    isStickyActionHead
                    isCheckedTablePagination
                  />
                  <TableBody>
                    {tableData.map((row, index) => (
                      <TramTableRow
                        headLabel={headerTable.filter((item) => item.checked === true)}
                        key={row.id}
                        row={row}
                        selected={selected.includes(row.id.toString())}
                        onSelectRow={() => onSelectRow(row.id.toString())}
                        onEditRow={() => handleEditRow(row)}
                      />
                    ))}

                    <TableNoData
                      title={
                        !isFiltered
                          ? 'Dữ liệu trạm đang trống'
                          : 'Không tìm thấy dữ liệu được tìm kiếm'
                      }
                      isNotFound={!isFiltered ? dataEmpty : isNotFound}
                      haveBtnCreate
                      haveBtnImport={false}
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
      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="top-right"
        sx={{ marginTop: '10px' }}
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
        <PermissionBgProcessWrapper
          module="TRAM"
          action="SYNCHRONIZED"
          hideWhenBlocked
          blockedComponentPropsOverride={{ disabled: true, onClick: () => {} }}
        >
          <MenuItem
            onClick={() => {
              handleSyncTramFromPTM();
              handleClosePopover();
            }}
          >
            <Iconify icon="eva:sync-outline" />
            Đồng bộ trạm từ phát triển mạng
          </MenuItem>
        </PermissionBgProcessWrapper>
      </MenuPopover>
      {openCreate && (
        <CreateTramProvider>
          <TramCreate
            title={dataRow ? 'Cập nhật Trạm' : 'Thêm mới Trạm'}
            open={openCreate}
            initData={
              dataRow
                ? {
                    id: dataRow.id,
                    dmPhongDai: {
                      id: dataRow.dmPhongDai.id.toString(),
                      ten: dataRow.dmPhongDai.ten,
                    },
                    dmTo: dataRow.dmTo?.id
                      ? {
                          id: dataRow.dmTo.id.toString(),
                          ten: dataRow.dmTo.ten,
                        }
                      : null,
                    maTram: dataRow.maTram || '',
                    maTramErp: dataRow.maTramErp || '',
                    siteNameErp: dataRow.siteNameErp || '',
                    ten: dataRow.ten || '',
                    maDTXD: dataRow.maDauTuXayDung || '',
                    dmTinh: {
                      id: dataRow?.dmTinh?.id.toString(),
                      ten: dataRow?.dmTinh?.ten,
                    },
                    dmHuyen: dataRow.dmHuyen?.id
                      ? {
                          id: dataRow.dmHuyen.id.toString(),
                          ten: dataRow.dmHuyen.ten,
                        }
                      : null,
                    dmXa: dataRow.dmXa?.id
                      ? {
                          id: dataRow.dmXa.id.toString(),
                          ten: dataRow.dmXa.ten,
                        }
                      : null,
                    diaChi: dataRow.diaChi,
                    kinhDo: dataRow.kinhDo || '',
                    viDo: dataRow.viDo || '',
                    dmTramKhuVuc: dataRow.dmTramKhuVuc?.id
                      ? {
                          id: dataRow.dmTramKhuVuc.id.toString(),
                          ten: dataRow.dmTramKhuVuc.ten,
                        }
                      : null,
                    dmLoaiCsht: dataRow.dmLoaiCsht?.id
                      ? {
                          id: dataRow.dmLoaiCsht.id.toString(),
                          ten: dataRow.dmLoaiCsht.ten,
                        }
                      : null,
                    dmLoaiTram: dataRow.dmLoaiTram?.id
                      ? {
                          id: dataRow.dmLoaiTram.id.toString(),
                          ten: dataRow.dmLoaiTram.ten,
                        }
                      : null,
                    dmLoaiCotAngten: dataRow.dmLoaiCotAngten?.id
                      ? {
                          id: dataRow.dmLoaiCotAngten.id.toString(),
                          ten: dataRow.dmLoaiCotAngten.ten,
                        }
                      : null,
                    doCaoAngten: dataRow.doCaoAngten,
                    dmLoaiThietBiRanList:
                      dataRow.dmLoaiThietBiRanList?.length > 0
                        ? dataRow.dmLoaiThietBiRanList.map((item) => ({
                            id: item.id.toString(),
                            ten: item.ten,
                          }))
                        : [],
                    ghiChu: dataRow.ghiChu || '',
                    trangThaiHoatDong: dataRow.trangThaiHoatDong === 'HOAT_DONG',
                    daPhatSong: dataRow.daPhatSong || false,
                    ngayPhatSong: dataRow.ngayPhatSong ? new Date(dataRow.ngayPhatSong) : null,
                  }
                : null
            }
            onClose={() => handleOpenConfirm()}
            onSaveSuccess={() => handleCloseCreate()}
          />
        </CreateTramProvider>
      )}

      {openExportDialog && (
        <ChooseFieldsExportDialog
          open={openExportDialog}
          onClose={() => setOpenExportDialog(false)}
          headLabel={TABLE_HEAD.filter((col) => col.id !== 'createdAt')}
          selectRows={selected}
        />
      )}
      {openDragColumTable && (
        <DragColumnTable
          open={openDragColumTable}
          onClose={() => handleCloseDragColumnTable()}
          title="Sắp xếp các cột cho bảng Danh sách trạm"
          data={headerTable}
          onDragColumn={handleChangeDragColumn}
        />
      )}
      {openFilterAdvanced && (
        <FilterAdvanced
          open={openFilterAdvanced}
          onClose={() => handleCloseFilterAdvanced()}
          title="Lọc dữ liệu Danh sách trạm"
          // onFilterAdvanced={handleFilterAdvanced}
        />
      )}

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Cảnh báo"
        content={`Bạn có chắc chắn muốn thoát quá trình ${dataRow ? 'cập nhật' : 'tạo mới'}?`}
        action={
          <LoadingButton
            variant="contained"
            type="button"
            color="error"
            loading={false}
            onClick={handleCloseCreate}
          >
            Thoát
          </LoadingButton>
        }
      />
    </>
  );
};

export default TramContainer;
