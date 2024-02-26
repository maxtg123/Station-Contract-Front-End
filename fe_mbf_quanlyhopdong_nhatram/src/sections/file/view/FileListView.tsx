// @mui
import { Box, IconButton, Table, TableBody, TableContainer, Tooltip } from '@mui/material';
import Scrollbar from 'src/components/scrollbar/Scrollbar';
// @types
import { fileFormat } from 'src/components/file-thumbnail';
import { storagePath } from 'src/utils/fileUtils';
import { IFileData } from '../../../@types/file';
// components
import Iconify from '../../../components/iconify';

import {
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableProps,
  TableSelectedAction,
} from '../../../components/table';
//
import FileTableRow from '../item/FileTableRow';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'file.name', label: 'Tên file', align: 'left' },
  { id: 'loai', label: 'Loại file', align: 'left' },
  { id: 'file.size', label: 'Size', align: 'left', width: 120 },
  { id: 'file.type', label: 'Định dạng', align: 'center', width: 120 },
  { id: 'createdAt', label: 'Ngày upload', align: 'left', width: 160 },
];

type Props = {
  table: TableProps;
  tableData: IFileData[];
  isNotFound: boolean;
  dataFiltered: IFileData[];
  onOpenConfirm: VoidFunction;
  onViewLightBox?: (imageUrl: string) => void;
};

export default function FileListView({
  table,
  tableData,
  isNotFound,
  dataFiltered,
  onOpenConfirm,
  onViewLightBox,
}: Props) {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    //
    selected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = table;
  return (
    <>
      <Box sx={{ px: 1, position: 'relative', borderRadius: 1.5, bgcolor: 'background.neutral' }}>
        <TableSelectedAction
          dense={dense}
          numSelected={selected.length}
          rowCount={tableData.length}
          onSelectAllRows={(checked) =>
            onSelectAllRows(
              checked,
              tableData.map((row) => row.id.toString())
            )
          }
          action={
            <Tooltip title="Tải xuống">
              <IconButton color="primary" onClick={onOpenConfirm}>
                <Iconify icon="eva:download-outline" />
              </IconButton>
            </Tooltip>
          }
          sx={{
            pl: 1,
            pr: 2,
            top: 8,
            width: 'auto',
            borderRadius: 1,
            position: 'relative',
          }}
        />

        <TableContainer>
          <Scrollbar>
            <Table
              size={dense ? 'small' : 'medium'}
              sx={{
                minWidth: 960,
                borderCollapse: 'separate',
                borderSpacing: '0 8px',
                '& .MuiTableCell-head': {
                  boxShadow: 'none !important',
                },
              }}
            >
              <TableHeadCustom
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={tableData.length}
                numSelected={selected.length}
                isNumIndex
                onSort={onSort}
                onSelectAllRows={(checked) =>
                  onSelectAllRows(
                    checked,
                    tableData.map((row) => row.id.toString())
                  )
                }
                sx={{
                  '& .MuiTableCell-head': {
                    bgcolor: 'transparent',
                  },
                }}
              />

              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <FileTableRow
                      key={row.id}
                      row={row}
                      no={index}
                      selected={selected.includes(row.id.toString())}
                      onSelectRow={() => onSelectRow(row.id.toString())}
                      onViewLightBox={() => {
                        if (fileFormat(row.path) === 'image' || fileFormat(row.path) === 'pdf') {
                          onViewLightBox?.(storagePath(row.path));
                        }
                      }}
                    />
                  ))}
                <TableNoData isNotFound={isNotFound} title="Không có dữ liệu" />
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>
      </Box>

      <TablePaginationCustom
        count={dataFiltered.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={onChangePage}
        onRowsPerPageChange={onChangeRowsPerPage}
        //
        dense={dense}
        onChangeDense={onChangeDense}
        sx={{
          '& .MuiTablePagination-root': { borderTop: 'none' },
          '& .MuiFormControlLabel-root': { px: 0 },
        }}
      />
    </>
  );
}
