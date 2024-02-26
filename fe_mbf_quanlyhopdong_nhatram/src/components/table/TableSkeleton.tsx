// @mui
import {
  TableRow,
  TableCell,
  Skeleton,
  Stack,
  TableRowProps,
  TableBody,
  Table,
  TableHead,
} from '@mui/material';

// ----------------------------------------------------------------------

export default function TableSkeleton({
  countRow,
  ...other
}: { countRow: number } & TableRowProps) {
  const array = Array.from({ length: countRow }, (v, i) => i);
  return (
    <Table>
      <TableHead />
      <TableBody>
        {array.map((item, index) => (
          <TableRow {...other} key={index}>
            <TableCell colSpan={12}>
              <Stack spacing={3} direction="row" alignItems="center">
                <Skeleton
                  variant="rectangular"
                  width={40}
                  height={40}
                  sx={{ borderRadius: 1, flexShrink: 0 }}
                />
                <Skeleton variant="text" width="100%" height={20} />
                <Skeleton variant="text" width={180} height={20} />
                <Skeleton variant="text" width={180} height={20} />
                <Skeleton variant="text" width={180} height={20} />
                <Skeleton variant="text" width={180} height={20} />
                <Skeleton variant="text" width={180} height={20} />
              </Stack>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
