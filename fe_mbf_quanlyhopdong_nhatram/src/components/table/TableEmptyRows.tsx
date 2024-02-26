// @mui
import { TableRow, TableCell } from '@mui/material';

// ----------------------------------------------------------------------

type Props = {
  emptyRows: number;
};
const HEIGHT_ROW = 72;
export default function TableEmptyRows({ emptyRows }: Props) {
  if (!emptyRows) {
    return null;
  }

  return (
    <TableRow
      sx={{
        height: HEIGHT_ROW,
      }}
    >
      <TableCell colSpan={9} />
    </TableRow>
  );
}
