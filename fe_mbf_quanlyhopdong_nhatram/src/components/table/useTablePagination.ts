import { useCallback, useMemo, useState } from 'react';
import { TablePropsPagination } from './types';

type UseTableProps<T extends { id: number }> = {
  defaultDense?: boolean;
  defaultOrder?: 'asc' | 'desc';
  defaultOrderBy?: string;
  defaultSelected?: string[];
  defaultRowsPerPage?: number;
  defaultCurrentPage?: number;
  tableData?: T[];
};

type ReturnType<T extends { id: number }> = TablePropsPagination & {
  tableData: T[];
};

export default function useTablePagination<T extends { id: number }>(
  props?: UseTableProps<T>
): ReturnType<T> {
  const [dense, setDense] = useState(!!props?.defaultDense);
  const [orderBy, setOrderBy] = useState(props?.defaultOrderBy || 'name');
  const [order, setOrder] = useState<'asc' | 'desc'>(props?.defaultOrder || 'asc');
  const [page, setPage] = useState(props?.defaultCurrentPage || 0);
  const [rowsPerPage, setRowsPerPage] = useState(props?.defaultRowsPerPage || 5);
  const [selected, setSelected] = useState<string[]>(props?.defaultSelected || []);
  const tableData = useMemo(() => props?.tableData || [], [props?.tableData]);
  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === 'asc';
      if (id !== '') {
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(id);
      }
    },
    [order, orderBy]
  );

  const onSelectRow = useCallback(
    (id: string) => {
      const selectedIndex = selected.indexOf(id);
      let newSelected: string[] = [];

      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selected, id);
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selected.slice(1));
      } else if (selectedIndex === selected.length - 1) {
        newSelected = newSelected.concat(selected.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          selected.slice(0, selectedIndex),
          selected.slice(selectedIndex + 1)
        );
      }

      setSelected(newSelected);
    },
    [selected]
  );
  const onSelectAllRows = useCallback(() => {
    let updatedSelectedRows: string[] = [];

    if (selected.length < tableData.length) {
      const currentPageIds = tableData.map((row) => row.id.toString());
      updatedSelectedRows = [...selected, ...currentPageIds.filter((id) => !selected.includes(id))];
      setSelected(updatedSelectedRows);
    } else if (selected.length > tableData.length) {
      setSelected(tableData.map((row) => row.id.toString()));
      const currentPageIds = tableData.map((row) => row.id.toString());
      updatedSelectedRows = [...selected];
      const selectedCountOnCurrentPage = currentPageIds.reduce(
        (count, id) => (selected.includes(id) ? count + 1 : count),
        0
      );
      if (selectedCountOnCurrentPage === 0) {
        // Chọn tất cả các hàng trên trang hiện tại
        updatedSelectedRows.push(...currentPageIds);
      } else {
        currentPageIds.forEach((id) => {
          const index = updatedSelectedRows.indexOf(id);
          if (index !== -1) {
            updatedSelectedRows.splice(index, 1);
          }
        });
      }
      setSelected(updatedSelectedRows);
    } else if (selected.length === tableData.length) {
      const currentPage = Math.floor(page / rowsPerPage);
      const currentPageIds = tableData.map((row) => row.id.toString());
      if (page === currentPage) {
        setSelected([]);
      } else {
        updatedSelectedRows = [
          ...selected,
          ...currentPageIds.filter((id) => !selected.includes(id)),
        ];
        setSelected(updatedSelectedRows);
      }
    }
  }, [page, rowsPerPage, selected, tableData]);

  const onChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const onChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
  }, []);

  const onChangeDense = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  }, []);

  return {
    dense,
    order,
    page,
    orderBy,
    rowsPerPage,
    selected,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
    onSelectRow,
    onSelectAllRows,
    onSort,
    setDense,
    setOrder,
    setOrderBy,
    setSelected,
    setRowsPerPage,
    setPage,
    tableData,
  };
}
