import { TableCell, TableRow } from '@mui/material';
import get from 'lodash/get';
import { IHopDongLichSu } from 'src/@types/hopDongLichSu';
import { IHead } from 'src/@types/common';
import ChangeLogs from 'src/components/change-logs/ChangeLogs';
import { transform } from 'src/utils/hopDongLichSuUtils';
import { fDateTime } from 'src/utils/formatTime';

// ----------------------------------------------------------------------

type Props = {
  row: IHopDongLichSu;
  no: number;
  headLabel: IHead[];
};

export default function LichSuHDTableRow({ no, row, headLabel }: Props) {
  return (
    <TableRow hover>
      <TableCell>{no}</TableCell>
      {headLabel.map((cell) => {
        const data = get(row, cell.value);

        if (cell.id === 'changeLog') {
          return (
            <TableCell align="left" key={cell.id}>
              <ChangeLogs logs={transform((data ? JSON.parse(data) : null), row.version) || []} />
            </TableCell>
          );
        }

        if (cell.id === 'nguoiDung') {
          return (
            <TableCell align="left" key={cell.id}>
              {data.email}
            </TableCell>
          );
        }

        if (cell.id === 'createdAt') {
          return (
            <TableCell align="left" key={cell.id}>
              {fDateTime(data)}
            </TableCell>
          );
        }

        return <TableCell key={cell.id} />;
      })}
    </TableRow>
  );
}
