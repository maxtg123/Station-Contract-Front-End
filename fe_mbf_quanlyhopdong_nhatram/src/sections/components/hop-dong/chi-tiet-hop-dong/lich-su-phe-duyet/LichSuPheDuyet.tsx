import {
  Box,
  CircularProgress,
  Stack,
  Table,
  TableBody,
  TableHead,
  Typography,
} from '@mui/material';
import isNil from 'lodash/isNil';
import { useEffect } from 'react';
import { TableNoData } from 'src/components/table';
import { useChiTietHopDongContext } from 'src/context/hop-dong/chitietHopDongContext';
import { usePheDuyetsOfHopDongQuery } from 'src/data/pheduyetHopDong';
import LanPheDuyetItem from './LanPheDuyetItem';

type Props = {
  hopDongId: number;
  isTabChange: boolean;
};
const LichSuPheDuyet = ({ hopDongId, isTabChange }: Props) => {
  const {
    state: { refetchPheDuyet, rightBar },
    dispatch,
  } = useChiTietHopDongContext();

  const { data, refetch, isLoading } = usePheDuyetsOfHopDongQuery(
    { hopDongId },
    { enabled: !!hopDongId, refetchOnWindowFocus: true }
  );

  useEffect(() => {
    if (refetchPheDuyet) {
      refetch().then(({ isSuccess, data: refreshData }) => {
        const currentPheDuyet = refreshData?.elements?.find(
          (dt) => dt.id === rightBar?.id && rightBar.type === 'phe_duyet'
        );
        if (currentPheDuyet) {
          dispatch({
            type: 'set-data-for-right-bar',
            payload: { type: 'phe_duyet', data: currentPheDuyet, id: currentPheDuyet.id },
          });
        }
      });
      dispatch({ type: 'toggle-refresh-phe-duyet' });
    }
  }, [refetchPheDuyet, refetch, dispatch, rightBar]);
  return isLoading ? (
    <Box sx={{ width: '100%', height: '100%' }} p={10}>
      <Stack direction="row" alignItems="center" justifyContent="center">
        <CircularProgress />
      </Stack>
    </Box>
  ) : (
    <Stack direction="column" spacing={2} mb={2}>
      {!isNil(data?.elements) && data?.elements && data?.elements?.length > 0 ? (
        <>
          <Typography variant="h6">Thông tin phê duyệt hợp đồng</Typography>
          {data?.elements.map((item, i) => (
            <LanPheDuyetItem key={item.id} id={item.id} item={item} isTabChange={isTabChange} />
          ))}
        </>
      ) : (
        <Table sx={{ display: 'flex', justifyContent: 'center' }}>
          <TableHead />
          <TableBody>
            <TableNoData title="Chưa có dữ liệu" isNotFound />
          </TableBody>
        </Table>
      )}
    </Stack>
  );
};

export default LichSuPheDuyet;
