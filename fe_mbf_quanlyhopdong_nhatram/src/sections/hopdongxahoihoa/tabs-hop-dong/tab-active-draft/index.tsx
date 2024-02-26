import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableContainer,
  Tooltip,
} from '@mui/material';
import debounce from 'lodash/debounce';
import isNil from 'lodash/isNil';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { memo, useEffect, useMemo, useState } from 'react';
import { IHead, IKeyValuePair } from 'src/@types/common';
import { IHopDongForm } from 'src/@types/hopdongmatbang';
import ConfirmDialog from 'src/components/confirm-dialog/ConfirmDialog';
import Iconify from 'src/components/iconify/Iconify';
import Scrollbar from 'src/components/scrollbar/Scrollbar';
import {
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableSelectedAction,
  TableSkeleton,
  getComparator,
  useTable,
} from 'src/components/table';
import { PATH_HOP_DONG_MAT_BANG } from 'src/routes/paths';
// import HopDongSidebar from '../../HopDongSidebar';
import { IHopDongXaHoiHoa } from 'src/@types/hopdongxahoihoa';
import {
  DRAG_HOP_DONG_XA_HOI_HOA_COL,
  TABLE_HEAD_HOP_DONG_XA_HOI_HOA,
} from 'src/constants/hopdongxahoihoa.constant';
import { useHopDongXaHoiHoaFilterContext } from 'src/context/hop-dong-xa-hoi-hoa/hopDongXaHoiHoaFilterContext';

import { CustomChip } from 'src/components/custom-chip';
import PermissionWrapper from 'src/components/permission-wrapper';
import { SearchTotalResult } from 'src/components/search-not-found';
import { defaultObjectFilterHopDong } from 'src/constants/hopdong.constant';
import {
  tienTrinhAction,
  tienTrinhMessage,
  tienTrinhModule,
} from 'src/constants/tientrinh.constant';
import { useListHopDongXaHoiHoaContext } from 'src/context/hop-dong-xa-hoi-hoa/listHopDongXaHoiHoaContext';
import { useHopDongXaHoiHoaQuery } from 'src/data/hopDongXaHoiHoa';
import { useGetPhuLucsHopDongFromWebCu } from 'src/data/hopdong';
import { addBgProcess } from 'src/utils/bgProcessLocalStorage';
import { fDate } from 'src/utils/formatTime';
import HopDongXaHoiHoaTableRow from '../../HopDongXaHoiHoaTableRow';
import HopDongTableToolbar from '../../HopDongXaHoiHoaTableToolbar';

const FilterAdvancedHopDongXaHoiHoa = dynamic(() => import('../../FilterAdvancedHopDongXaHoiHoa'));
const DragColumnTableHopDongXaHoiHoa = dynamic(
  () => import('../../DragColumnTableHopDongXaHoiHoa')
);
const GuiPheDuyetDialog = dynamic(
  () => import('src/sections/hopdongmatbang/phe-duyet/GuiPheDuyetDialog')
);
const GiaoViecDialog = dynamic(() => import('src/sections/hopdongmatbang/giaoviec/GiaoViecDialog'));
const GET_ALL = 10000;

type Props = {
  type: 'active' | 'draft';
  module?: 'GIAO_VIEC' | 'HOP_DONG' | 'THANH_TOAN';
};
const TabActiveOrDraft = ({ type, module }: Props) => {
  const router = useRouter();
  const {
    state: { filterHopDongFields, filterFormFields },
    dispatch,
  } = useHopDongXaHoiHoaFilterContext();
  const {
    dispatch: dispatchTab,
    state: { activeTab },
  } = useListHopDongXaHoiHoaContext();
  const storedData = localStorage.getItem(DRAG_HOP_DONG_XA_HOI_HOA_COL);
  const initialHeaderTable = storedData ? JSON.parse(storedData) : TABLE_HEAD_HOP_DONG_XA_HOI_HOA;

  const [activeTableData, setActiveTableData] = useState<IHopDongXaHoiHoa[]>([]);
  const [draftTableData, setDraftTableData] = useState<IHopDongXaHoiHoa[]>([]);
  const [filterName, setFilterName] = useState<string>('');
  const [filterNameDraftHopDong, setFilterNameDrafHopDong] = useState<string>('');
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openDragColumTable, setOpenDragColumnTable] = useState(false);
  const [headerTable, setHeaderTable] = useState<IHead[]>(initialHeaderTable);
  const [dataRow, setDataRow] = useState<IHopDongXaHoiHoa | null>(null);
  const [updateData, setUpdateData] = useState<IHopDongForm | null>(null);
  const [openSidebar, setOpenSidebar] = useState(false);
  const [openFilterAdvanced, setOpenFilterAdvanced] = useState(false);
  const [openGuiPheDuyetHopDong, setOpenGuiPheDuyetHopDong] = useState(false);
  const [openGiaoViecDialog, setOpenGiaoViecDialog] = useState(false);
  const [openConfirmSyncPhuLucData, setOpenConfirmSyncData] = useState(false);
  const [listChipFilter, setListChipFilter] = useState<IKeyValuePair[]>([]);
  const {
    dense,
    page,
    rowsPerPage,
    setPage,

    order,
    orderBy,
    //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onChangePage,
    onChangeRowsPerPage,
    onChangeDense,
  } = useTable();
  const { data, isLoading, isError, isFetching } = useHopDongXaHoiHoaQuery(
    {
      size: type === 'active' ? rowsPerPage : GET_ALL,
      page: type === 'active' ? page : 0,
      loaiHopDong: 'XA_HOI_HOA',
      // size: rowsPerPage,
      // page,
      trangThaiHopDong: type === 'active' ? 'HOAT_DONG' : 'NHAP',
      ...(filterName && { search: filterName.trimStart().trimEnd() }),
      ...filterHopDongFields,
    },
    {
      refetchOnWindowFocus: false,
    }
  );
  const { mutate: getPhuLucFromWebCu } = useGetPhuLucsHopDongFromWebCu();
  useEffect(() => {
    if (!isLoading && !isError && !isNil(data?.elements)) {
      if (data?.elements) {
        if (type === 'active') {
          setActiveTableData(data.elements);
        } else if (type === 'draft') {
          setDraftTableData(data.elements);
        }
      }
    }
  }, [isLoading, isError, data, type]);
  useEffect(() => {
    const arr: IKeyValuePair[] = Object.entries(filterFormFields)
      .map(([key, value]) => ({
        key,
        value,
      }))
      .filter(({ value }) => value !== null && value !== '' && value !== undefined);
    setListChipFilter(arr);
  }, [filterFormFields]);
  const dataDraftFiltered = useMemo(
    () =>
      applyFilter({
        inputData: draftTableData,
        comparator: getComparator(order, orderBy),
        filterNameDraftHopDong,
      }),
    [draftTableData, order, orderBy, filterNameDraftHopDong]
  );

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
    filterHopDongFields.idXa !== null;

  const isFilteredActiveHopDong = filterName !== '' || filteHopDongMatBangContext;
  const isFilteredDraftHopDong = filterNameDraftHopDong !== '' || filteHopDongMatBangContext;

  const isNotFound =
    type === 'active'
      ? !activeTableData.length && isFilteredActiveHopDong
      : !dataDraftFiltered.length && isFilteredDraftHopDong;
  const dataEmpty =
    type === 'active'
      ? !activeTableData.length && filterName === ''
      : !dataDraftFiltered.length && filterName === '';
  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleFilterName = debounce((event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(0);
    setFilterName(event.target.value);
  }, 500);
  const handleFilterNameDraftHopDong = debounce((event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(0);
    setFilterNameDrafHopDong(event.target.value);
  }, 500);

  const handleResetFilter = () => {
    if (type === 'active') {
      setFilterName('');
      dispatch({ type: 'reset-form-filter' });
    }
    if (type === 'draft') {
      setFilterNameDrafHopDong('');
      dispatch({ type: 'reset-form-filter' });
    }
  };

  // Drag column hợp đồng
  const handleOpenDragColumnTable = () => {
    setOpenDragColumnTable(true);
  };

  const handleCloseDragColumnTable = () => {
    setOpenDragColumnTable(false);
  };

  const handleChangeDragColumn = (value: IHead[]) => {
    setHeaderTable(value);
  };

  const handleEditRow = async (row: IHopDongXaHoiHoa) => {
    // setDataRow(row);
    // setUpdateData(await transformRowToForm(row));

    setOpenSidebar(true);
  };

  // Filter advanced hợp đồng
  const handleOpenFilterAdvanced = () => {
    setOpenFilterAdvanced(true);
  };

  const handleCloseFilterAdvanced = () => {
    setOpenFilterAdvanced(false);
  };

  const handleOpenSidebar = () => {
    setOpenSidebar(true);
  };

  const handleCloseSideBar = () => {
    setDataRow(null);
    setUpdateData(null);

    setOpenSidebar(false);

    handleCloseConfirm();
  };

  const handleDetailRow = (id: number) => {
    router.push(`${PATH_HOP_DONG_MAT_BANG.root}/${id}`);
  };

  const handleGuiPheDuyetHopDong = (row: IHopDongXaHoiHoa) => {
    setOpenGuiPheDuyetHopDong(true);
    setDataRow(row);
  };
  const handleGiaoViecDialog = (row: IHopDongXaHoiHoa) => {
    setOpenGiaoViecDialog(true);
    setDataRow(row);
  };
  const handleDeletedChipTab = () => {
    dispatchTab({ type: 'set-active-tab', payload: 'active' });
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
    handleResetFilter();
    dispatchTab({ type: 'set-active-tab', payload: 'active' });
    dispatch({ type: 'reset-form-filter' });
  };

  const renderContentTable = () => {
    if (type === 'active') {
      return (
        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <TableSelectedAction
            dense={dense}
            numSelected={selected.length}
            rowCount={activeTableData.length}
            onSelectAllRows={(checked) =>
              onSelectAllRows(
                checked,
                activeTableData.map((row: any) => row.id)
              )
            }
            action={
              /**
               * * Nếu là module Giao việc thì sẽ action Giao việc
               * * Ngược lại là action của Module hợp đồng
               */
              module === 'GIAO_VIEC' ? (
                <PermissionWrapper
                  module="DAM_PHAN"
                  action="GIAO_VIEC"
                  hideWhenBlocked
                  checkAt="atLeastPD"
                >
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Iconify icon="eva:shopping-bag-outline" />}
                    onClick={() => setOpenGiaoViecDialog(true)}
                  >
                    Giao việc
                  </Button>
                </PermissionWrapper>
              ) : (
                <Box>
                  {selected.length === 1 && (
                    <Tooltip title="Chỉnh sửa">
                      <IconButton
                        color="primary"
                        onClick={() => {
                          const findRow = activeTableData.find(
                            (item) => item.id.toString() === selected.toString()
                          );
                          if (findRow) {
                            handleEditRow(findRow);
                          }
                        }}
                      >
                        <Iconify icon="eva:edit-2-outline" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              )
            }
            sx={{ position: 'relative' }}
          />
          <Scrollbar>
            <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
              <TableHeadCustom
                headLabel={headerTable.filter((item) => item.checked === true)}
                rowCount={activeTableData.length}
                numSelected={selected.length}
                // isNumIndex
                onSelectAllRows={(checked) =>
                  onSelectAllRows(
                    checked,
                    activeTableData.map((row) => row.id.toString())
                  )
                }
                isStickyActionHead
              />
              <TableBody>
                {activeTableData.map((row, index) => (
                  <HopDongXaHoiHoaTableRow
                    no={index}
                    key={row.id + row.soHopDong}
                    row={row}
                    selected={selected.includes(row.id.toString())}
                    onEditRow={() => handleEditRow(row)}
                    onDetailRow={() => handleDetailRow(row.id)}
                    onSelectRow={() => {
                      onSelectRow(row.id.toString());
                    }}
                    headLabel={headerTable.filter((item) => item.checked === true)}
                    onGiaoViecDialog={() => handleGiaoViecDialog(row)}
                    module={module}
                  />
                ))}
                <TableNoData
                  title={
                    !isFilteredActiveHopDong
                      ? 'Dữ liệu hợp đồng đang trống'
                      : 'Không tìm thấy dữ liệu được tìm kiếm'
                  }
                  isNotFound={!isFilteredActiveHopDong ? dataEmpty : isNotFound}
                  haveBtnCreate
                  handleOpenCreate={handleOpenSidebar}
                />
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>
      );
    }
    return (
      <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
        <TableSelectedAction
          dense={dense}
          numSelected={selected.length}
          rowCount={dataDraftFiltered.length}
          onSelectAllRows={(checked) =>
            onSelectAllRows(
              checked,
              dataDraftFiltered.map((row: any) => row.id)
            )
          }
          action={
            <Box>
              {selected.length === 1 && (
                <Tooltip title="Chỉnh sửa">
                  <IconButton
                    color="primary"
                    onClick={() => {
                      const findRow = dataDraftFiltered.find(
                        (item) => item.id.toString() === selected.toString()
                      );
                      if (findRow) {
                        handleEditRow(findRow);
                      }
                    }}
                  >
                    <Iconify icon="eva:edit-2-outline" />
                  </IconButton>
                </Tooltip>
              )}
              <Button
                onClick={() => {
                  setOpenGuiPheDuyetHopDong(true);
                }}
                variant="contained"
                startIcon={<Iconify icon="eva:checkmark-circle-fill" />}
              >
                Gửi phê duyệt
              </Button>
            </Box>
          }
          sx={{ position: 'relative' }}
        />
        <Scrollbar>
          <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
            <TableHeadCustom
              headLabel={headerTable.filter((item) => item.checked === true)}
              rowCount={dataDraftFiltered.length}
              numSelected={selected.length}
              // isNumIndex
              onSelectAllRows={(checked) =>
                onSelectAllRows(
                  checked,
                  dataDraftFiltered.map((row) => row.id.toString())
                )
              }
              isStickyActionHead
              tooltips={[
                {
                  id: 'tinhTrangThanhToan',
                  component: (
                    <Tooltip title="Tính đến ngày hiện tại">
                      <IconButton color="default">
                        <Iconify icon="eva:alert-circle-fill" />
                      </IconButton>
                    </Tooltip>
                  ),
                },
              ]}
            />
            <TableBody>
              {dataDraftFiltered
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <HopDongXaHoiHoaTableRow
                    no={index}
                    key={row.id + row.soHopDong}
                    row={row}
                    selected={selected.includes(row.id.toString())}
                    onEditRow={() => handleEditRow(row)}
                    onDetailRow={() => handleDetailRow(row.id)}
                    onSelectRow={() => {
                      onSelectRow(row.id.toString());
                    }}
                    headLabel={headerTable.filter((item) => item.checked === true)}
                  />
                ))}

              <TableNoData
                title={
                  !isFilteredDraftHopDong
                    ? 'Dữ liệu hợp đồng xã hội hóa đang trống'
                    : 'Không tìm thấy dữ liệu được tìm kiếm'
                }
                isNotFound={!isFilteredDraftHopDong ? dataEmpty : isNotFound}
                haveBtnCreate
                handleOpenCreate={handleOpenSidebar}
              />
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>
    );
  };
  const handleSyncFile = () => {};
  const handleOpenConfirmSyncPhuLuc = () => {
    setOpenConfirmSyncData(true);
  };
  const handleSyncPhuLuc = () => {
    getPhuLucFromWebCu([], {
      onSuccess: (res: any) => {
        if (res) {
          addBgProcess({
            id: res,
            module: tienTrinhModule.HOP_DONG,
            action: tienTrinhAction.HOP_DONG.DONG_BO_PHU_LUC_TU_CHUONG_TRINH_CU,
            messageSuccess: tienTrinhMessage.HOP_DONG.DONG_BO_PHU_LUC_TU_CHUONG_TRINH_CU.SUCCESS,
            messageError: tienTrinhMessage.HOP_DONG.DONG_BO_PHU_LUC_TU_CHUONG_TRINH_CU.ERROR,
            messageLoading: tienTrinhMessage.HOP_DONG.DONG_BO_PHU_LUC_TU_CHUONG_TRINH_CU.LOADING,
          });
          setOpenConfirmSyncData(false);
        }
      },
      onError: (error: any) => {
        console.log(error);
      },
    });
    setOpenConfirmSyncData(false);
  };
  return (
    <Box>
      <HopDongTableToolbar
        filterName={type === 'active' ? filterName : filterNameDraftHopDong}
        isFiltered={type === 'active' ? isFilteredActiveHopDong : isFilteredDraftHopDong}
        onFilterName={type === 'active' ? handleFilterName : handleFilterNameDraftHopDong}
        onResetFilter={handleResetFilter}
        onDragColumnTable={handleOpenDragColumnTable}
        // onSyncFile={type === 'active' ? undefined : handleSyncFile}
        onSyncPhuLuc={type === 'active' ? undefined : handleOpenConfirmSyncPhuLuc}
        onFilterAdvanced={handleOpenFilterAdvanced}
      />
      <Box sx={{ marginX: 3, marginBottom: 2 }}>
        {(type === 'active' ? isFilteredActiveHopDong : isFilteredDraftHopDong) && (
          <SearchTotalResult
            total={type === 'active' ? data?.metadata?.total || 0 : dataDraftFiltered.length}
          />
        )}
        <Stack direction="row" flexWrap="wrap" gap={1} alignItems="center">
          {activeTab !== 'active' && (
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
          {(activeTab !== 'active' ||
            (type === 'active' ? isFilteredActiveHopDong : isFilteredDraftHopDong)) && (
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
      {!isFetching ? renderContentTable() : <TableSkeleton countRow={rowsPerPage} />}

      <TablePaginationCustom
        count={type === 'active' ? data?.metadata?.total || 0 : dataDraftFiltered.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={onChangePage}
        onRowsPerPageChange={onChangeRowsPerPage}
        dense={dense}
        onChangeDense={onChangeDense}
      />

      {/* {openSidebar && (
        <CreateHopDongProvider>
          <HopDongSidebar
            open={openSidebar}
            onClose={handleOpenConfirm}
            onSaveSuccess={() => handleCloseSideBar()}
            initData={updateData}
          />
        </CreateHopDongProvider>
      )} */}
      {openDragColumTable && (
        <DragColumnTableHopDongXaHoiHoa
          open={openDragColumTable}
          onClose={() => handleCloseDragColumnTable()}
          title="Sắp xếp các cột cho bảng Danh sách hợp đồng xã hội hóa"
          data={headerTable}
          onDragColumn={handleChangeDragColumn}
        />
      )}
      {openFilterAdvanced && (
        <FilterAdvancedHopDongXaHoiHoa
          open={openFilterAdvanced}
          onClose={() => handleCloseFilterAdvanced()}
          title="Lọc dữ liệu Danh sách hợp đồng xã hội hóa"
        />
      )}

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Cảnh báo"
        content={`Bạn có chắc chắn muốn thoát quá trình ${updateData ? 'cập nhật' : 'tạo mới'}?`}
        action={
          <LoadingButton
            variant="contained"
            type="button"
            color="error"
            loading={false}
            onClick={handleCloseSideBar}
          >
            Thoát
          </LoadingButton>
        }
      />

      {/* {openGuiPheDuyetHopDong && (
        <GuiPheDuyetDialog
          open
          onClose={() => setOpenGuiPheDuyetHopDong(false)}
          onSuccess={() => {
            setOpenGuiPheDuyetHopDong(false);
            setSelected([]);
          }}
          selectedRow={
            dataRow
              ? [dataRow]
              : data?.elements?.filter((dt) => !!selected.includes(dt.id.toString())) || []
          }
          title="Gửi phê duyệt hợp đồng"
        />
      )}
      {openGiaoViecDialog && (
        <GiaoViecDialog
          open
          onClose={() => setOpenGiaoViecDialog(false)}
          onSuccess={() => {
            setOpenGiaoViecDialog(false);
            setSelected([]);
          }}
          selectedRow={
            dataRow
              ? [dataRow]
              : data?.elements?.filter((dt) => !!selected.includes(dt.id.toString())) || []
          }
          title="Giao việc"
        />
      )} */}
      {openConfirmSyncPhuLucData && (
        <ConfirmDialog
          open={openConfirmSyncPhuLucData}
          onClose={() => {
            setOpenConfirmSyncData(false);
          }}
          title="Xác nhận"
          content="Bạn có chắc chắn đồng bộ phụ lục hợp đồng từ chương trình cũ?"
          action={
            <LoadingButton
              variant="contained"
              type="button"
              color="primary"
              onClick={handleSyncPhuLuc}
            >
              Chắc chắn
            </LoadingButton>
          }
        />
      )}
    </Box>
  );
};

function applyFilter({
  inputData,
  comparator,
  filterNameDraftHopDong,
}: {
  inputData: IHopDongXaHoiHoa[];
  comparator: (a: any, b: any) => number;
  filterNameDraftHopDong: string;
}) {
  if (!inputData.length) return [];
  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterNameDraftHopDong) {
    inputData = inputData.filter((item) => {
      let soHopDongFilter = false;
      if (!isNil(item?.soHopDong)) {
        soHopDongFilter =
          item.soHopDong.toLowerCase().indexOf(filterNameDraftHopDong.toLowerCase()) !== -1;
      }
      let soHopDongErpFilter = false;
      if (!isNil(item?.soHopDongErp)) {
        soHopDongErpFilter =
          item.soHopDongErp.toLowerCase().indexOf(filterNameDraftHopDong.toLowerCase()) !== -1;
      }
      let maTramFilter = false;
      if (!isNil(item?.hopDongTramList)) {
        maTramFilter = item.hopDongTramList.some((el) =>
          el.tram?.maTram?.toLowerCase().includes(filterNameDraftHopDong.toLowerCase())
        );
      }
      let maTramErpFilter = false;
      if (!isNil(item?.hopDongTramList)) {
        maTramErpFilter = item.hopDongTramList.some((el) =>
          el.tram?.maTramErp?.toLowerCase().includes(filterNameDraftHopDong.toLowerCase())
        );
      }
      let maDTXDFilter = false;
      if (!isNil(item?.hopDongTramList)) {
        maDTXDFilter = item.hopDongTramList.some((el) =>
          el.tram?.maDauTuXayDung?.toLowerCase().includes(filterNameDraftHopDong.toLowerCase())
        );
      }

      return (
        soHopDongFilter || soHopDongErpFilter || maTramFilter || maTramErpFilter || maDTXDFilter
      );
    });
  }

  return inputData;
}

export default memo(TabActiveOrDraft);
