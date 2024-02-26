import { Box, TableCell, TableRow, Typography } from '@mui/material';
import get from 'lodash/get';
import { IActivityLog } from 'src/@types/activityLog';
import { IHead } from 'src/@types/common';
import ChangeLogs from 'src/components/change-logs/ChangeLogs';
import { LabelColor } from 'src/components/label';
import Label from 'src/components/label/Label';
import {
  LABELS_MAP_ACTION,
  LABELS_MAP_MODULE,
  LABEL_COLORS_ACTION,
  MAP_ACTION,
} from 'src/constants/activityLog.constant';
import { transform } from 'src/utils/activityUtils';
import { fDateTime } from 'src/utils/formatTime';

// ----------------------------------------------------------------------

type Props = {
  row: IActivityLog;
  no: number;
  headLabel: IHead[];
};

export default function ActivityLogTableRow({ no, row, headLabel }: Props) {
  return (
    <TableRow hover>
      <TableCell>{no}</TableCell>
      {headLabel.map((cell) => {
        const data = get(row, cell.value);
        if (cell.id === 'module') {
          return (
            <TableCell align="left" key={cell.id} width="100px">
              {LABELS_MAP_MODULE[data] || data}
            </TableCell>
          );
        }

        if (cell.id === 'action') {
          if (data) {
            const color: LabelColor = LABEL_COLORS_ACTION[data] as LabelColor;
            return (
              <TableCell align="left" key={cell.id}>
                <Label variant="outlined" color={color}>
                  {LABELS_MAP_ACTION[data] || data}
                </Label>
              </TableCell>
            );
          }

          return (
            <TableCell align="left" key={cell.id}>
              <Label variant="outlined" color="error">
                Not yet data
              </Label>
            </TableCell>
          );
        }

        if (cell.id === 'changeLog') {
          const parsedData = data ? JSON.parse(data) : null;
          return (
            <TableCell align="left" key={cell.id}>
              <Typography sx={{ color: 'text.secondary' }} variant="body2">
                <Box component="span" sx={{ fontWeight: 'bold' }}>
                  {parsedData?.forModel?.name || ''}
                </Box>
                {` được ${MAP_ACTION[parsedData?.type] || ''}`}
              </Typography>
              <ChangeLogs logs={transform(data ? JSON.parse(data) : null) || []} />
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
