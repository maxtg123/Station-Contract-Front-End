// @mui
import { TableCell, TableRow } from '@mui/material';
import EmptyContent from '../empty-content/EmptyContent';
//

// ----------------------------------------------------------------------

type Props = {
  isNotFound: boolean;
  handleOpenCreate?: VoidFunction;
  handleOpenImport?: VoidFunction;
  title: string;
  haveBtnCreate?: boolean;
  haveBtnImport?: boolean;
};

export default function TableNoData({
  title,
  isNotFound,
  handleOpenCreate,
  handleOpenImport,
  haveBtnCreate = false,
  haveBtnImport = false,
}: Props) {
  return (
    <TableRow>
      {isNotFound ? (
        <TableCell colSpan={12}>
          <EmptyContent
            handleOpenCreate={handleOpenCreate}
            handleOpenImport={handleOpenImport}
            title={title}
            haveBtnCreate={haveBtnCreate}
            haveBtnImport={haveBtnImport}
            sx={{
              '& span.MuiBox-root': { height: 160 },
            }}
          />
        </TableCell>
      ) : (
        <TableCell colSpan={12} sx={{ p: 0 }} />
      )}
    </TableRow>
  );
}
