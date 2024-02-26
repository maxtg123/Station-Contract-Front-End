import {
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@mui/material';
import { IHopDongTienTrinhChange } from 'src/@types/damphan';
import Scrollbar from 'src/components/scrollbar/Scrollbar';
import { TableHeadCustom } from 'src/components/table';
import TrendingInfo from 'src/components/trending-info/TrendingInfo';
import { useChiTietHopDongContext } from 'src/context/hop-dong/chitietHopDongContext';
import { useTramQuery } from 'src/data/tram';
import { fCurrencyVND } from 'src/utils/formatNumber';

type Props = {
  changes: IHopDongTienTrinhChange[];
  tramId: number | null;
};
const TableNoiDungDamPhan = ({ tramId, changes }: Props) => {
  const {
    state: { hopDong },
  } = useChiTietHopDongContext();

  const { data } = useTramQuery(tramId || 0, {
    refetchOnWindowFocus: false,
    enabled: tramId !== null,
  });

  if (!changes || changes.length === 0) {
    return null;
  }

  const giaHienTai =
    hopDong?.hopDongTramList.find((hdTram) => tramId && hdTram.tramId === tramId)?.giaThue || 0;
  return (
    <Stack direction="column" spacing={2}>
      <Typography variant="overline" color="text.disabled" pl={3}>
        {tramId
          ? `Nội dung của trạm ${data?.elements?.[0]?.maTram}`
          : `Nội dung chung của hợp đồng`}
      </Typography>
      <TableContainer sx={{ overflow: 'unset' }}>
        <Scrollbar sx={{ minWidth: 520 }}>
          <Table>
            <TableHeadCustom
              headLabel={[
                { id: 'ten', label: 'Tên', minWidth: '200px' },
                { id: 'content', label: 'Nội dung', width: '300px' },
                { id: 'ghiChu', label: 'Ghi chú', width: '300px' },
                { id: 'changed', label: '' },
              ]}
            />
            <TableBody>
              {changes.map((row, index) => (
                <ChangedRow key={row.id} row={row} index={index} giaHienTai={giaHienTai} />
              ))}
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>
    </Stack>
  );
};

// ----------------------------------------------------------------------

type ChangedRowProps = {
  row: IHopDongTienTrinhChange;
  index: number;
  giaHienTai: number;
};

const getLabelByKey = (key: string): string => {
  let result: string = key;
  if (key === 'thoi_gian_gia_han') {
    result = 'Thời gian gia hạn';
  } else if (key === 'gia_cn_de_xuat') {
    result = 'Giá chủ nhà đề xuất';
  } else if (key === 'gia_quy_dinh') {
    result = 'Giá quy định';
  }
  return result;
};
function ChangedRow({ row, index, giaHienTai }: ChangedRowProps) {
  return (
    <TableRow>
      <TableCell width="200px">
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {index + 1}
        </Typography>
      </TableCell>
      <TableCell width="300px">
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {getLabelByKey(row.key)}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {['gia_cn_de_xuat', 'gia_quy_dinh'].includes(row.key)
            ? fCurrencyVND(row.value)
            : row.value}
        </Typography>
      </TableCell>
      <TableCell width="300px">
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {row.ghiChu}
        </Typography>
      </TableCell>
      <TableCell>
        {row.key === 'gia_cn_de_xuat' && (
          <Stack>
            <TrendingInfo
              percent={((Number(row.value) - giaHienTai) / giaHienTai) * 100}
              text={` so với ${fCurrencyVND(giaHienTai)}`}
            />
          </Stack>
        )}
      </TableCell>
    </TableRow>
  );
}

export default TableNoiDungDamPhan;
