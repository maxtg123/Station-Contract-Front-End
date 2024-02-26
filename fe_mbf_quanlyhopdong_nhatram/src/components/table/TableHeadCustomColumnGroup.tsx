// @mui
import {
  Box,
  Checkbox,
  SxProps,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from '@mui/material';
import { Theme } from '@mui/material/styles';
import { ReactNode } from 'react';
// ----------------------------------------------------------------------

const visuallyHidden = {
  border: 0,
  margin: -1,
  padding: 0,
  width: '1px',
  height: '1px',
  overflow: 'hidden',
  position: 'absolute',
  whiteSpace: 'nowrap',
  clip: 'rect(0 0 0 0)',
} as const;

// ----------------------------------------------------------------------

type Props = {
  order?: 'asc' | 'desc';
  orderBy?: string;
  headLabel: any[];
  headLabelColumnGroup: any[];
  rowCount?: number;
  numSelected?: number;
  onSort?: (id: string) => void;
  onSelectAllRows?: (checked: boolean) => void;
  sx?: SxProps<Theme>;
  isNumIndex?: boolean;
  isStickyActionHead?: boolean;
  tooltips?: { id: string; component: ReactNode }[];
};

export default function TableHeadCustomColumnGroup({
  order,
  orderBy,
  rowCount = 0,
  headLabel,
  headLabelColumnGroup,
  numSelected = 0,
  onSort,
  onSelectAllRows,
  sx,
  isNumIndex,
  isStickyActionHead = false,
  tooltips,
}: Props) {
  return (
    <TableHead sx={sx}>
      <TableRow>
        {headLabelColumnGroup.map((item) => (
          <TableCell
            sx={{ borderBottom: '1px solid #DDE1E7', borderRight: '1px solid #DDE1E7' }}
            align="center"
            colSpan={item.colSpan}
            key={item.id}
          >
            {item.label}
          </TableCell>
        ))}
      </TableRow>
      <TableRow>
        {!isNumIndex ? <TableCell padding="normal">No</TableCell> : <></>}
        {onSelectAllRows && (
          <TableCell
            padding="checkbox"
            style={
              isStickyActionHead
                ? { position: 'sticky', left: 0, zIndex: 1, backgroundColor: 'white' }
                : {}
            }
          >
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                onSelectAllRows(event.target.checked)
              }
            />
          </TableCell>
        )}
        {headLabel.map((headCell) => {
          if (headCell.id === 'dongSo' && isStickyActionHead) {
            return (
              <TableCell
                key={headCell.id}
                align={headCell.align || 'left'}
                style={{ position: 'sticky', left: 0, zIndex: 5 }}
              >
                {headCell.label}
              </TableCell>
            );
          }
          return (
            <TableCell
              key={headCell.id}
              align={headCell.align || 'left'}
              sortDirection={orderBy === headCell.id ? order : false}
              sx={{ width: headCell.width, minWidth: headCell.minWidth }}
            >
              {onSort ? (
                <TableSortLabel
                  hideSortIcon
                  active={orderBy === headCell.id}
                  direction={orderBy === headCell.id ? order : 'asc'}
                  onClick={() => onSort(headCell.id)}
                  sx={{ textTransform: 'capitalize' }}
                >
                  {headCell.label}

                  {orderBy === headCell.id ? (
                    <Box sx={{ ...visuallyHidden }}>
                      {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                    </Box>
                  ) : null}
                </TableSortLabel>
              ) : (
                headCell.label
              )}
              {tooltips &&
                tooltips.length > 0 &&
                tooltips.find((tt) => tt.id === headCell.id)?.component}
            </TableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
}
