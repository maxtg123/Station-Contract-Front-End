import type { SxProps, TablePaginationProps } from '@mui/material';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import TablePagination from '@mui/material/TablePagination';
import { Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

type Props = {
  dense?: boolean;
  onChangeDense?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  sx?: SxProps<Theme>;
};

export default function TablePaginationCustom({
  rowsPerPageOptions = [5, 10, 25],
  sx,
  dense,
  onChangeDense,
  ...other
}: Props & TablePaginationProps) {
  return (
    <Box sx={{ position: 'relative', ...sx }}>
      <TablePagination
        rowsPerPageOptions={rowsPerPageOptions}
        labelRowsPerPage="Số dòng mỗi trang"
        component="div"
        {...other}
      />
      {onChangeDense && (
        <FormControlLabel
          label="Làm gọn"
          control={<Switch checked={dense} onChange={onChangeDense} />}
          sx={{
            pl: 2,
            py: 1.5,
            top: 0,
            position: {
              md: 'absolute',
            },
          }}
        />
      )}
    </Box>
  );
}
