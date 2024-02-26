/* eslint-disable prefer-destructuring */
import { Box, Link, Stack, Tooltip, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ReactNode } from 'react';
import { IHopDongPheDuyet, ITienTrinhPheDuyet } from 'src/@types/hopdong';
import { CustomAvatar } from 'src/components/custom-avatar';
import Label from 'src/components/label/Label';
import PermissionWrapper from 'src/components/permission-wrapper';
import { useChiTietHopDongContext } from 'src/context/hop-dong/chitietHopDongContext';
import useAuthCredentials from 'src/hooks/useAuthCredentials';
import { fDateTime } from 'src/utils/formatTime';
import { getTrangThaiPheDuyet } from 'src/utils/hopDongPheDuyetUtils';
import { IResultDiff, convertDiffHopDong } from 'src/utils/logUtils';
import PheDuyetCommentForm from './PheDuyetCommentForm';

const StyledLabel = styled('span')(({ theme }) => ({
  ...theme.typography.body2,
  width: 120,
  flexShrink: 0,
  color: theme.palette.text.secondary,
}));

const PheDuyet = () => {
  const { profile } = useAuthCredentials();
  const {
    state: { rightBar, hopDong },
  } = useChiTietHopDongContext();

  if (!rightBar || rightBar.type !== 'phe_duyet' || !rightBar.data) {
    return null;
  }

  const data = rightBar.data as IHopDongPheDuyet;
  console.log('data: ', data);

  const coPhaiBanNamTrongDanhSachPheDuyet = data.hopDongPheDuyetNguoiNhanModelList.some(
    (u) => u.nguoiDung.email === profile?.email
  );
  const banLaNguoiGui = data.nguoiGuiId === profile?.id;
  const lastTienTrinh = data?.hopDongPheDuyetTienTrinhList?.[0];
  const lastTienTrinhWithoutChangeHD = data?.hopDongPheDuyetTienTrinhList?.filter(
    (tt) => tt.trangThaiPheDuyet !== 'UPDATE_HOP_DONG'
  )?.[0];

  return (
    <Box sx={{ pt: 2 }}>
      {/* <Scrollbar> */}
      <Stack spacing={3} sx={{ px: 2, pb: 2 }}>
        <Typography variant="h6">Tiến trình phê duyệt hợp đồng</Typography>
        {/* Nguoi gui */}
        <Stack direction="row" alignItems="center">
          <StyledLabel>Người gửi</StyledLabel>
          <Link>{data.nguoiGui.email}</Link>
        </Stack>
        {/* Ngay Gui */}
        <Stack direction="row" alignItems="center">
          <StyledLabel>Ngày gửi</StyledLabel>
          <Typography variant="body2">{fDateTime(data.createdAt)}</Typography>
        </Stack>
        {/* Nguoi phe duyet */}
        <Stack direction="row" alignItems="center">
          <StyledLabel>Người phê duyệt</StyledLabel>
          <Stack direction="row" flexWrap="wrap" alignItems="center">
            {data.hopDongPheDuyetNguoiNhanModelList.map((user) => {
              return (
                <Tooltip key={user.nguoiDung.id} title={user.nguoiDung.email}>
                  <CustomAvatar name={user.nguoiDung.email} />
                </Tooltip>
              );
            })}
          </Stack>
        </Stack>
      </Stack>
      <Stack
        spacing={3}
        sx={{
          py: 3,
          px: 2.5,
          bgcolor: 'background.neutral',
        }}
      >
        {data.hopDongPheDuyetTienTrinhList.map((dt) => {
          const { email, ngay, content, title } = getPheDuyetItemContent(dt);
          // console.log('change logs: ', dt?.changeLogClob ? JSON.parse(dt.changeLogClob) : null);
          const changedLogs: IResultDiff[] = convertDiffHopDong(
            dt?.changeLogClob ? JSON.parse(dt.changeLogClob) : null
          );
          return (
            <Stack direction="row" spacing={2} key={dt.id}>
              <CustomAvatar name={email} />
              <Stack direction="column" spacing={0.5}>
                <Stack direction="column">
                  <Typography variant="subtitle2">{email}</Typography>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    justifyContent="flex-start"
                  >
                    <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                      {fDateTime(ngay)}
                    </Typography>
                    {typeof title === 'string' ? (
                      <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                        {title}
                      </Typography>
                    ) : (
                      title
                    )}
                  </Stack>
                </Stack>
                {/* <ChangeLogs logs={changedLogs} /> */}
                <Typography variant="body2" sx={{ color: 'text.secondary', whiteSpace: 'pre' }}>
                  {content}
                </Typography>
              </Stack>
            </Stack>
          );
        })}
      </Stack>
      {/* </Scrollbar> */}
      <PermissionWrapper module="HOP_DONG" action="XET_DUYET" checkAt="allPD" hideWhenBlocked>
        {coPhaiBanNamTrongDanhSachPheDuyet &&
        lastTienTrinhWithoutChangeHD &&
        ['CHO_PHE_DUYET', 'GUI_LAI'].includes(lastTienTrinhWithoutChangeHD.trangThaiPheDuyet) &&
        ['CHO_PHE_DUYET_HOP_DONG', 'CHO_PHE_DUYET_PHU_LUC'].includes(
          hopDong?.trangThaiHopDong || ''
        ) ? (
          <Stack sx={{ p: 2 }}>
            <PheDuyetCommentForm formType="xet_duyet" />
          </Stack>
        ) : (
          <Box />
        )}
      </PermissionWrapper>

      {banLaNguoiGui &&
        lastTienTrinhWithoutChangeHD &&
        lastTienTrinhWithoutChangeHD.trangThaiPheDuyet === 'TU_CHOI' && (
          <Stack sx={{ p: 2 }}>
            <PheDuyetCommentForm formType="gui_lai" />
          </Stack>
        )}
    </Box>
  );
};

const getPheDuyetItemContent = (
  pheduyet: ITienTrinhPheDuyet
): { email: string; ngay: Date; content: string; title: string | ReactNode } => {
  const email = pheduyet.nguoiDung.email;
  const ngay = new Date(pheduyet.createdAt);
  const content = pheduyet?.ghiChu || '';
  let title;
  const { color, text } = getTrangThaiPheDuyet(pheduyet.trangThaiPheDuyet);
  switch (pheduyet.trangThaiPheDuyet) {
    case 'CHO_PHE_DUYET':
      title = 'Đã gửi nhờ xét duyệt';
      break;
    case 'TU_CHOI': {
      title = (
        <Label color={color} sx={{ mr: 1 }}>
          {text}
        </Label>
      );
      break;
    }
    case 'PHE_DUYET': {
      title = (
        <Label color={color} sx={{ mr: 1 }}>
          {text}
        </Label>
      );
      break;
    }
    case 'GUI_LAI': {
      title = (
        <Label color={color} sx={{ mr: 1 }}>
          {text}
        </Label>
      );
      break;
    }
    case 'UPDATE_HOP_DONG': {
      title = (
        <Label color={color} sx={{ mr: 1 }}>
          {text}
        </Label>
      );
      break;
    }
    default:
      break;
  }
  return {
    email,
    ngay,
    content,
    title,
  };
};

export default PheDuyet;
