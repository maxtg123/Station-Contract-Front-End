import { Button, Card, Link, Stack, Typography } from '@mui/material';
import { useEffect } from 'react';
import { IHopDongPheDuyet } from 'src/@types/hopdong';
import Label from 'src/components/label/Label';
import { useChiTietHopDongContext } from 'src/context/hop-dong/chitietHopDongContext';
import useAuthCredentials from 'src/hooks/useAuthCredentials';
import { fDateTime } from 'src/utils/formatTime';
import { getTrangThaiPheDuyet, getTypeXetDuyet } from 'src/utils/hopDongPheDuyetUtils';

type Props = {
  id: number;
  isTabChange: boolean;
  item: IHopDongPheDuyet;
};
const LanPheDuyetItem = ({ id, item, isTabChange }: Props) => {
  const { profile } = useAuthCredentials();

  const {
    state: { rightBar },
    dispatch,
  } = useChiTietHopDongContext();

  useEffect(() => {
    if (isTabChange) {
      handleViewDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTabChange]);

  const pheduyetGanNhat = item.hopDongPheDuyetTienTrinhList?.[0];
  if (!pheduyetGanNhat) {
    return null;
  }

  const { color, text } = getTrangThaiPheDuyet(item.trangThaiPheDuyetMoiNhat);
  const typeXetDuyet = getTypeXetDuyet('hop_dong'); // TODO check with phu_luc

  const handleViewDetail = () => {
    dispatch({
      type: 'set-data-for-right-bar',
      payload: { type: 'phe_duyet', data: item, id },
    });
  };

  const isActive = rightBar?.type === 'phe_duyet' && rightBar?.id === id;

  const coPhaiBanNamTrongDanhSachPheDuyet = item.hopDongPheDuyetNguoiNhanModelList?.some(
    (nd) => nd.nguoiDungId === profile?.id
  );

  return (
    <Card
      sx={{
        p: 3,
        mb: 3,
        background: '#F4F6F8',
        boxShadow: 'none',
        ...(isActive && { background: 'rgba(145, 158, 171, 0.16)' }),
      }}
    >
      <Stack
        sx={{ background: isActive ? '#F4F6F8' : 'white', p: 2, borderRadius: 2 }}
        spacing={2}
        alignItems={{
          md: 'flex-end',
        }}
        direction={{
          xs: 'column',
          md: 'row',
        }}
      >
        <Stack flexGrow={1} spacing={1}>
          {/* First Line */}
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="column">
              <Stack direction="row" alignItems="center" spacing={1}>
                {item.trangThaiPheDuyetMoiNhat !== 'CHO_PHE_DUYET' && pheduyetGanNhat.nguoiDung && (
                  <Typography variant="subtitle1">
                    <Link>{pheduyetGanNhat.nguoiDung.email}</Link>
                  </Typography>
                )}
                <Label color={color}>{text}</Label>
              </Stack>

              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                {fDateTime(pheduyetGanNhat.createdAt)}
              </Typography>
            </Stack>

            <Stack>
              <Label color={typeXetDuyet.color}>{typeXetDuyet.text}</Label>
            </Stack>
          </Stack>

          <Stack direction="row" alignItems="center" gap="2px">
            <Typography variant="body2">Danh sách người được phê duyệt:</Typography>
            <Stack direction="row" alignItems="center" gap="4px">
              {item.hopDongPheDuyetNguoiNhanModelList?.map((u) => (
                <Typography variant="body2" key={u.nguoiDung.email}>
                  <Link key={u.nguoiDung.email}>{u.nguoiDung.email}</Link>
                </Typography>
              ))}
            </Stack>
          </Stack>

          <Typography variant="body2">
            Người gửi xét duyệt: <Link>{item.nguoiGui.email}</Link>
          </Typography>

          {/* Last Line */}
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Ngày gửi xét duyệt: {fDateTime(item.createdAt)}
            </Typography>
            <Button variant="outlined" size="small" onClick={handleViewDetail}>
              {coPhaiBanNamTrongDanhSachPheDuyet &&
              pheduyetGanNhat.trangThaiPheDuyet === 'CHO_PHE_DUYET'
                ? 'Phê duyệt'
                : 'Xem tiến trình'}
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
};

export default LanPheDuyetItem;
