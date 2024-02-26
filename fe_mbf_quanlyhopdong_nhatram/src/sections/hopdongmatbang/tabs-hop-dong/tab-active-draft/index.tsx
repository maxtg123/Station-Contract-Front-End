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
import { memo, useEffect, useState } from 'react';
import { IHead, IKeyValuePair } from 'src/@types/common';
import { ITrangThaiHopDongQuery } from 'src/@types/hopdong';
import { IHopDong } from 'src/@types/hopdongmatbang';
import { IListTramByHopDong } from 'src/@types/thanhtoan';
import ConfirmDialog from 'src/components/confirm-dialog/ConfirmDialog';
import { CustomChip } from 'src/components/custom-chip';
import Iconify from 'src/components/iconify/Iconify';
import Scrollbar from 'src/components/scrollbar/Scrollbar';
import { SearchTotalResult } from 'src/components/search-not-found';
import {
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableSelectedAction,
  TableSkeleton,
} from 'src/components/table';
import useTablePagination from 'src/components/table/useTablePagination';
import { defaultObjectFilterHopDong } from 'src/constants/hopdong.constant';
import {
  DRAG_HOP_DONG_COL,
  HEAD_HOP_DONG_TRAM_LIST,
  TABLE_HEAD_HOP_DONG,
} from 'src/constants/hopdongmatbang.constant';
import {
  tienTrinhAction,
  tienTrinhMessage,
  tienTrinhModule,
} from 'src/constants/tientrinh.constant';
import { CreateHopDongProvider } from 'src/context/hop-dong-mat-bang/createHopDongContext';
import { useHopDongFilterContext } from 'src/context/hop-dong-mat-bang/hopDongFilterContext';
import { useListHopDongContext } from 'src/context/hop-dong-mat-bang/listHopDongContext';
import { useHopDongQuery } from 'src/data/hopDongMatBang';
import { useGetHopDongThuHuongFromWebCu, useGetPhuLucsHopDongFromWebCu } from 'src/data/hopdong';
import { PATH_HOP_DONG_MAT_BANG } from 'src/routes/paths';
import { addBgProcess } from 'src/utils/bgProcessLocalStorage';
import { fDate } from 'src/utils/formatTime';
import { removeDuplicatesHopDong } from 'src/utils/hopDongUtils';
import HopDongSidebar from '../../HopDongSidebar';
import HopDongTableRow from '../../HopDongTableRow';
import HopDongTableToolbar from '../../HopDongTableToolbar';
import TienHanhThanhToanDialog from '../../thanhtoan/thanh-toan-model/TienHanhThanhToanDialog';

const FilterAdvancedHopDong = dynamic(() => import('../../FilterAdvancedHopDong'));
const DragColumnTableHopDong = dynamic(() => import('../../DragColumnTableHopDong'));
const ExportHopDongDialog = dynamic(
  () => import('../../../components/hop-dong/export/ChooseFieldsExportHopDong')
);
const GuiPheDuyetDialog = dynamic(
  () => import('src/sections/hopdongmatbang/phe-duyet/GuiPheDuyetDialog')
);
const GiaoViecDialog = dynamic(() => import('src/sections/hopdongmatbang/giaoviec/GiaoViecDialog'));

type Props = {
  type: 'active' | 'draft';
  module?: 'GIAO_VIEC' | 'HOP_DONG' | 'THANH_TOAN';
};
const TabActiveOrDraft = ({ type, module }: Props) => {
  const router = useRouter();
  const {
    state: { filterHopDongFields, filterFormFields },
    dispatch,
  } = useHopDongFilterContext();
  const {
    dispatch: dispatchTab,
    state: { activeTab },
  } = useListHopDongContext();
  const storedData = localStorage.getItem(DRAG_HOP_DONG_COL);
  const initialHeaderTable = storedData ? JSON.parse(storedData) : TABLE_HEAD_HOP_DONG;
  const [activeTableData, setActiveTableData] = useState<IHopDong[]>([]);
  const [draftTableData, setDraftTableData] = useState<IHopDong[]>([]);
  const [filterName, setFilterName] = useState<string>('');
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openDragColumTable, setOpenDragColumnTable] = useState(false);
  const [headerTable, setHeaderTable] = useState<IHead[]>(initialHeaderTable);
  const [dataRow, setDataRow] = useState<IHopDong | null>(null);
  const [openSidebar, setOpenSidebar] = useState(false);
  const [openFilterAdvanced, setOpenFilterAdvanced] = useState(false);
  const [openGuiPheDuyetHopDong, setOpenGuiPheDuyetHopDong] = useState(false);
  const [openGiaoViecDialog, setOpenGiaoViecDialog] = useState(false);
  const [openConfirmSyncPhuLucData, setOpenConfirmSyncData] = useState(false);
  const [openConfirmSyncThongtinThuHuong, setOpenConfirmSyncThongTinThuHuong] = useState(false);
  const [listChipFilter, setListChipFilter] = useState<IKeyValuePair[]>([]);
  const [openExportHopDong, setOpenExportHopDong] = useState(false);
  const [saveDataSeleted, setSaveDataSeleted] = useState<IHopDong[]>([]);
  const [selectedTramByContract, setSelectedTramByContract] = useState<IListTramByHopDong[]>([]);
  const [openThanhToan, setOpenThanhToan] = useState(false);

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
    tableData: type === 'active' ? activeTableData : draftTableData,
  });
  let trangThaiHopDong: ITrangThaiHopDongQuery = 'HOAT_DONG';
  if (type === 'active' && module === 'GIAO_VIEC') {
    trangThaiHopDong = 'SAP_HET_HAN';
  } else if (type === 'draft') {
    trangThaiHopDong = 'NHAP';
  }
  const { data, isLoading, isError, isFetching } = useHopDongQuery(
    {
      size: rowsPerPage,
      page,
      loaiHopDong: 'MAT_BANG',
      trangThaiHopDong,
      ...(filterName && { search: filterName.trimStart().trimEnd() }),
      ...filterHopDongFields,
    },
    {
      refetchOnWindowFocus: false,
    }
  );
  const { mutate: getPhuLucFromWebCu } = useGetPhuLucsHopDongFromWebCu();
  const { mutate: getHopDongThuHuongFromWebCu } = useGetHopDongThuHuongFromWebCu();
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
  /**
   * * Khi seleted sẽ lưu lại những dòng đã chọn
   */
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
  }, [selected, data, selectedTramByContract]);
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
    filterHopDongFields.idTinh !== null ||
    filterHopDongFields.idHuyen !== null ||
    filterHopDongFields.idXa !== null ||
    filterHopDongFields.phongDaiId !== null ||
    filterHopDongFields.tinhTrangHopDong !== null;
  const filterHopDongThanhToanContext =
    filterHopDongFields.tinhTrangThanhToan !== null ||
    filterHopDongFields.kyThanhToanFrom !== null ||
    filterHopDongFields.kyThanhToanTo !== null;
  const isFilteredHopDong =
    filterName !== '' ||
    (type === 'active' ? filterHopDongThanhToanContext : filteHopDongMatBangContext);
  const isNotFound =
    type === 'active'
      ? !activeTableData.length && (isFilteredHopDong || filterHopDongThanhToanContext)
      : !draftTableData.length && isFilteredHopDong;
  const dataEmpty =
    type === 'active'
      ? !activeTableData.length && filterName === ''
      : !draftTableData.length && filterName === '';
  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };
  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleEditRow = async (row: IHopDong) => {
    setDataRow(row);

    setOpenSidebar(true);
  };
  const handleCloseSideBar = () => {
    setDataRow(null);
    // setUpdateData(null);
    setOpenSidebar(false);
    handleCloseConfirm();
  };

  const handleFilterName = debounce((event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(0);
    setSelected([]);
    setFilterName(event.target.value);
  }, 500);
  const handleResetFilter = () => {
    setFilterName('');
    dispatch({ type: 'reset-form-filter' });
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

  // Export hop dong

  const handleOpenExportHopDong = () => {
    setOpenExportHopDong(true);
  };
  const handleCloseExportHopDong = () => {
    setOpenExportHopDong(false);
  };

  // Thanh toán
  const handleOpenThanhToan = () => {
    setOpenThanhToan(true);
  };
  const handleCloseThanhToan = () => {
    setOpenThanhToan(false);
  };

  const handleDetailRow = (id: number) => {
    router.push(`${PATH_HOP_DONG_MAT_BANG.root}/${id}`);
  };

  const handleGuiPheDuyetHopDong = (row: IHopDong) => {
    setOpenGuiPheDuyetHopDong(true);
    setDataRow(row);
  };
  const handleGiaoViecDialog = (row: IHopDong) => {
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
    if (tramId.length > 0) {
      const filterSelectedHopDong = selected.filter((item) => item === contractId);
      if (!filterSelectedHopDong.length) {
        selected.push(contractId.toString());
      }
    }
  };
  const renderContentTable = () => {
    if (type === 'active') {
      return (
        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <TableSelectedAction
            dense={dense}
            numSelected={selected.length}
            rowCount={data?.elements ? data.metadata.total : 0}
            onSelectAllRows={() => onSelectAllRows()}
            action={
              /**
               * * Nếu là module Giao việc thì sẽ action Giao việc
               * * Ngược lại là action của Module hợp đồng
               */
              module === 'GIAO_VIEC' ? (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Iconify icon="eva:shopping-bag-outline" />}
                  onClick={() => setOpenGiaoViecDialog(true)}
                  disabled={
                    activeTableData.filter(
                      (el) =>
                        selected.includes(el.id.toString()) &&
                        el.hopDongDamPhanList?.length > 0 &&
                        el.hopDongDamPhanList[0].trangThaiDamPhanMoiNhat !== 'PHE_DUYET'
                    ).length > 0
                  }
                >
                  Giao việc
                </Button>
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
                  <Button
                    onClick={handleOpenThanhToan}
                    variant="contained"
                    startIcon={<Iconify icon="eva:checkmark-circle-outline" />}
                  >
                    Tiến hành thanh toán
                  </Button>
                </Box>
              )
            }
            sx={{ position: 'relative' }}
          />
          <Scrollbar>
            <Table
              size={dense ? 'small' : 'medium'}
              sx={{
                minWidth: 800,
              }}
            >
              <TableHeadCustom
                headLabel={headerTable.filter((item) => item.checked === true)}
                rowCount={data?.elements ? data.metadata.total : 0}
                numSelected={selected.length}
                onSelectAllRows={() => onSelectAllRows()}
                totalCurrentOnPage={activeTableData.length}
                isStickyActionHead
                isCheckedTablePagination
              />
              <TableBody>
                {activeTableData.map((row, index) => (
                  <HopDongTableRow
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
                    onGuiPheDuyetHopDong={() => handleGuiPheDuyetHopDong(row)}
                    onGiaoViecDialog={() => handleGiaoViecDialog(row)}
                    module={module}
                    onSelectedTram={handleSelectTram}
                    type="active"
                  />
                ))}
                <TableNoData
                  title={
                    !isFilteredHopDong
                      ? 'Dữ liệu hợp đồng mặt bằng đang trống'
                      : 'Không tìm thấy dữ liệu được tìm kiếm'
                  }
                  isNotFound={!isFilteredHopDong ? dataEmpty : isNotFound}
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
          rowCount={data?.elements ? data.metadata.total : 0}
          onSelectAllRows={() => onSelectAllRows()}
          action={
            <Box>
              {selected.length === 1 && (
                <Tooltip title="Chỉnh sửa">
                  <IconButton
                    color="primary"
                    onClick={() => {
                      const findRow = draftTableData.find(
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
              {/* checkSamePhongDaiId(
                dataDraftFiltered.filter((dt) => selected.includes(dt.id.toString()))
              ) &&  */}
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
              rowCount={data?.elements ? data.metadata.total : 0}
              numSelected={selected.length}
              totalCurrentOnPage={draftTableData.length}
              onSelectAllRows={() => onSelectAllRows()}
              isStickyActionHead
              isCheckedTablePagination
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
              {draftTableData.map((row, index) => (
                <HopDongTableRow
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
                  onGuiPheDuyetHopDong={() => handleGuiPheDuyetHopDong(row)}
                />
              ))}

              <TableNoData
                title={
                  !isFilteredHopDong
                    ? 'Dữ liệu hợp đồng mặt bằng đang trống'
                    : 'Không tìm thấy dữ liệu được tìm kiếm'
                }
                isNotFound={!isFilteredHopDong ? dataEmpty : isNotFound}
                haveBtnCreate
                handleOpenCreate={handleOpenSidebar}
              />
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>
    );
  };

  // Sync Phụ lục
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
  // Sync Thông tin thụ hưởng
  const handleOpenConfirmSyncThongTinThuHuong = () => {
    setOpenConfirmSyncThongTinThuHuong(true);
  };
  const handleSyncThongTinThuHuong = () => {
    getHopDongThuHuongFromWebCu([], {
      onSuccess: (res: any) => {
        if (res) {
          addBgProcess({
            id: res,
            module: tienTrinhModule.HOP_DONG,
            action: tienTrinhAction.HOP_DONG.DONG_BO_THONG_TIN_THU_HUONG_TU_CHUONG_TRINH_CU,
            messageSuccess:
              tienTrinhMessage.HOP_DONG.DONG_BO_THONG_TIN_THU_HUONG_TU_CHUONG_TRINH_CU.SUCCESS,
            messageError:
              tienTrinhMessage.HOP_DONG.DONG_BO_THONG_TIN_THU_HUONG_TU_CHUONG_TRINH_CU.ERROR,
            messageLoading:
              tienTrinhMessage.HOP_DONG.DONG_BO_THONG_TIN_THU_HUONG_TU_CHUONG_TRINH_CU.LOADING,
          });
          setOpenConfirmSyncThongTinThuHuong(false);
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
        isNotFound={isNotFound}
        filterName={filterName}
        type={type}
        module={module}
        onFilterName={handleFilterName}
        onDragColumnTable={handleOpenDragColumnTable}
        // onSyncFile={type === 'active' ? undefined : handleSyscFile}
        onSyncPhuLuc={type === 'active' ? undefined : handleOpenConfirmSyncPhuLuc}
        onSynsHopDongThuHuong={
          type === 'active' ? undefined : handleOpenConfirmSyncThongTinThuHuong
        }
        onFilterAdvanced={handleOpenFilterAdvanced}
        onExport={handleOpenExportHopDong}
      />

      <Box sx={{ marginX: 3, marginBottom: 2 }}>
        {isFilteredHopDong && <SearchTotalResult total={data?.metadata?.total || 0} />}
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
          {(activeTab !== 'active' || isFilteredHopDong) && (
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
        count={data?.metadata?.total || 0}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={onChangePage}
        onRowsPerPageChange={onChangeRowsPerPage}
        dense={dense}
        onChangeDense={onChangeDense}
      />

      {openSidebar && (
        <CreateHopDongProvider>
          <HopDongSidebar
            open={openSidebar}
            onClose={handleOpenConfirm}
            onSaveSuccess={() => handleCloseSideBar()}
            hopDongId={dataRow?.id || null}
          />
        </CreateHopDongProvider>
      )}
      {openDragColumTable && (
        <DragColumnTableHopDong
          open={openDragColumTable}
          onClose={() => handleCloseDragColumnTable()}
          title="Sắp xếp các cột cho bảng Danh sách hợp đồng"
          data={headerTable}
          onDragColumn={handleChangeDragColumn}
        />
      )}
      {openFilterAdvanced && (
        <FilterAdvancedHopDong
          open={openFilterAdvanced}
          onClose={() => handleCloseFilterAdvanced()}
          title="Lọc dữ liệu Danh sách hợp đồng"
        />
      )}
      {openExportHopDong && (
        <ExportHopDongDialog
          open={openExportHopDong}
          onClose={handleCloseExportHopDong}
          headLabel={TABLE_HEAD_HOP_DONG.concat(HEAD_HOP_DONG_TRAM_LIST).filter(
            (item) => item.id !== 'createdAt' && item.id !== 'updatedAt'
          )}
          loaiHopDong="MAT_BANG"
          trangThaiHopDong={trangThaiHopDong}
          selectRows={selected}
          filterAdvanced={filterHopDongFields}
          filterName={filterName}
        />
      )}

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Cảnh báo"
        content={`Bạn có chắc chắn muốn thoát quá trình ${openSidebar ? 'cập nhật' : 'tạo mới'}?`}
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
      {openGuiPheDuyetHopDong && (
        <GuiPheDuyetDialog
          open
          onClose={() => setOpenGuiPheDuyetHopDong(false)}
          onSuccess={() => {
            setOpenGuiPheDuyetHopDong(false);
            setSelected([]);
          }}
          selectedRow={dataRow ? [dataRow] : saveDataSeleted}
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
          selectedRow={dataRow ? [dataRow] : saveDataSeleted}
          title="Giao việc"
        />
      )}
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
      {openConfirmSyncThongtinThuHuong && (
        <ConfirmDialog
          open={openConfirmSyncThongtinThuHuong}
          onClose={() => {
            setOpenConfirmSyncThongTinThuHuong(false);
          }}
          title="Xác nhận"
          content="Bạn có chắc chắn đồng bộ thông tin hợp đồng thụ hưởng từ chương trình cũ?"
          action={
            <LoadingButton
              variant="contained"
              type="button"
              color="primary"
              onClick={handleSyncThongTinThuHuong}
            >
              Chắc chắn
            </LoadingButton>
          }
        />
      )}
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
    </Box>
  );
};

export default memo(TabActiveOrDraft);
