// next
import { Button, Card, Container, Table, TableBody, TableContainer } from '@mui/material';
import { saveAs } from 'file-saver';
import { useEffect, useState } from 'react';
// layouts
// components
import debounce from 'lodash/debounce';
import { useSnackbar } from 'notistack';
import { IHopDong } from 'src/@types/hopdongmatbang';
import { IListTramByHopDong, ITransFormDataThanhToan } from 'src/@types/thanhtoan';
import ConfirmDialog from 'src/components/confirm-dialog/ConfirmDialog';
import Scrollbar from 'src/components/scrollbar/Scrollbar';
import { useSettingsContext } from 'src/components/settings';
import {
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  useTable,
} from 'src/components/table';
import { TABLE_HEAD_HOP_DONG } from 'src/constants/hopdongmatbang.constant';
import {
  useExportBangKeKhaiThanhToanMutation,
  useExportThanhToanChiHoMutation,
  useThanhToanHopDongMutation,
} from 'src/data/hopDongMatBang';
import TienHanhThanhToanTableRow from './TienHanhThanhToanTableRow';
import TienHanhThanhToanTableToolbar from './TienHanhThanhToanTableToolbar';

// ----------------------------------------------------------------------

type Props = {
  data: IHopDong[];
  onCloseConfirm: VoidFunction;
  onResetSelectedAllRows: VoidFunction;
  selectedTramByContract: IListTramByHopDong[];
};
export default function TienHanhThanhToan({
  data,
  onCloseConfirm,
  onResetSelectedAllRows,
  selectedTramByContract,
}: Props) {
  const {
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();
  const { mutate: capNhatThanhToanHopDong, isLoading: updatingThanhToan } =
    useThanhToanHopDongMutation();
  const { mutate: exportThanhToanChiHo, isLoading: exporting } = useExportThanhToanChiHoMutation();
  const { mutate: exportBangKeKhaiThanhToan, isLoading: exportingBangKeKhaiThanhToan } =
    useExportBangKeKhaiThanhToanMutation();
  const { themeStretch } = useSettingsContext();
  const [tableData, setTableData] = useState<IHopDong[]>([]);
  const [openConfirm, setOpenConfirm] = useState(false);

  const [dataEditRows, setDataEditedRows] = useState<IHopDong[]>(data);

  const [filterName, setFilterName] = useState<string>('');

  const { enqueueSnackbar } = useSnackbar();
  const [listIdHopDong, setListIdHopDong] = useState<string[]>([]);
  const [listHopDongTramIdSelected, setListHopDongTramIdSelected] = useState<string[]>([]);
  useEffect(() => {
    const filteredList = data.filter((item) => {
      const matchedInput = selectedTramByContract.find(
        (inputItem) =>
          inputItem.hopDongId.toString() === item.id.toString() &&
          item.hopDongTramList.some((tram) => inputItem.listTramId.includes(tram.id.toString()))
      );
      return matchedInput !== undefined;
    });

    const result = filteredList.map((item) => {
      const filteredTrams = item.hopDongTramList.filter((tram) =>
        selectedTramByContract.some((inputItem) =>
          inputItem.listTramId.includes(tram.id.toString())
        )
      );
      return { ...item, hopDongTramList: filteredTrams };
    });
    const transformListIdHopDong = selectedTramByContract.map((item) => item.hopDongId);
    const transformHopDongTramIdSelected = selectedTramByContract.flatMap((item) =>
      item.listTramId.map((el) => el.toString())
    );
    setListIdHopDong(transformListIdHopDong);
    setListHopDongTramIdSelected(transformHopDongTramIdSelected);
    setTableData(result);
  }, [data, selectedTramByContract]);
  const isFiltered = filterName !== '';
  const handleFilterName = debounce((event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(0);
    setFilterName(event.target.value);
  }, 500);
  const handleResetFilter = () => {
    setFilterName('');
  };
  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };
  const handleSaveChangesThanhToan = (listHopDongTramId: string[]) => {
    const transformedData: ITransFormDataThanhToan[] = listHopDongTramId.map((id) => {
      return {
        hopHongTramId: parseInt(id, 10),
        ngayThanhToan: new Date(),
      };
    });
    console.log('transformedData: ', transformedData);
    if (transformedData.length > 0) {
      capNhatThanhToanHopDong(transformedData, {
        onSuccess: () => {
          enqueueSnackbar(`Thanh toán "${transformedData.length}" hợp đồng thành công`, {
            variant: 'success',
          });
          onCloseConfirm();
          onResetSelectedAllRows();
        },
        onError: (error: any) => {
          enqueueSnackbar('Có lỗi trong quá trình thanh toán hợp đồng', {
            variant: 'error',
          });
        },
      });
    }
  };

  const handleExportThanhToanChiHo = () => {
    const convertStringToNumber = listHopDongTramIdSelected.map((item) => parseInt(item, 10));
    const newData = {
      listHopDongTramId: convertStringToNumber,
      ngayLap: new Date(),
    };
    exportThanhToanChiHo(newData, {
      onSuccess: (res, variables, context) => {
        const contentDisposition = res.headers['content-disposition'];
        let fileName = 'Xuất chi hộ.xlsx';
        if (contentDisposition) {
          const matches = contentDisposition.match(/filename=([^;]+)/);
          fileName = matches && matches.length > 1 ? matches[1] : 'file';
        }

        saveAs(res.data, fileName);
      },
    });
  };
  const handleExportBangKeKhaiThanhToan = () => {
    const convertStringToNumber = listHopDongTramIdSelected.map((item) => parseInt(item, 10));
    const newData = {
      listHopDongTramId: convertStringToNumber,
      kyThanhToan: new Date(),
    };
    exportBangKeKhaiThanhToan(newData, {
      onSuccess: (res, variables, context) => {
        const contentDisposition = res.headers['content-disposition'];
        let fileName = 'Bảng kê khai thanh toán.xlsx';
        if (contentDisposition) {
          const matches = contentDisposition.match(/filename=([^;]+)/);
          fileName = matches && matches.length > 1 ? matches[1] : 'file';
        }
        saveAs(res.data, fileName);
      },
    });
  };

  return (
    <>
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Card>
          <TienHanhThanhToanTableToolbar
            isFiltered={isFiltered}
            onFilterName={handleFilterName}
            onResetFilter={handleResetFilter}
            countRow={tableData.length}
            onSaveChangesThanhToan={() => handleSaveChangesThanhToan(listHopDongTramIdSelected)}
            onExportThanhToanChiHo={handleExportThanhToanChiHo}
            onExportBangKeKhaiThanhToan={handleExportBangKeKhaiThanhToan}
            isLoadingExportBangKeKhaiThanhToan={exportingBangKeKhaiThanhToan}
            isLoadingUpdatingThanhToan={updatingThanhToan}
            isLoadingExportingThanhToan={exporting}
          />
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table size="small" sx={{ minWidth: 800 }}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD_HOP_DONG}
                  onSort={onSort}
                  rowCount={tableData.length}
                  numSelected={selected.length}
                />
                <TableBody>
                  {tableData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => (
                      <TienHanhThanhToanTableRow
                        no={index}
                        key={row.id}
                        row={row}
                        headLabel={TABLE_HEAD_HOP_DONG}
                      />
                    ))}

                  <TableNoData
                    title={
                      !isFiltered
                        ? 'Dữ liệu thanh toán đang trống'
                        : 'Không tìm thấy dữ liệu được tìm kiếm'
                    }
                    isNotFound={!tableData.length}
                  />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={tableData.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
          />
        </Card>
      </Container>
      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Thanh toán"
        content={
          <>
            Bạn có chắc chắn thanh toán <strong> {selected.length} </strong> hợp đồng?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleSaveChangesThanhToan(listHopDongTramIdSelected);
              handleCloseConfirm();
            }}
          >
            Đồng ý
          </Button>
        }
      />
    </>
  );
}
// function applyFilter({
//   inputData,
//   comparator,
//   filterName,
// }: {
//   inputData: IHopDong[];
//   comparator: (a: any, b: any) => number;
//   filterName: string;
// }) {
//   const stabilizedThis = inputData.map((el, index) => [el, index] as const);

//   stabilizedThis.sort((a, b) => {
//     const order = comparator(a[0], b[0]);
//     if (order !== 0) return order;
//     return a[1] - b[1];
//   });

//   inputData = stabilizedThis.map((el) => el[0]);

//   if (filterName) {
//     inputData = inputData.filter(
//       (item) =>
//         item.soHopDong.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
//         (item.soHopDongErp !== null &&
//           item.soHopDongErp.toLowerCase().indexOf(filterName.toLowerCase()) !== -1) ||
//         item.tram.maTram.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
//         (item.tram.maTramErp !== null &&
//           item.tram.maTramErp.toLowerCase().indexOf(filterName.toLowerCase()) !== -1)
//     );
//   }
//   return inputData;
// }
