import { CardHeader, Link, Stack, Tooltip, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { IHopDongDamPhan } from 'src/@types/damphan';
import { CustomAvatar } from 'src/components/custom-avatar';
import { fDate, fDateTime } from 'src/utils/formatTime';
import MucDoUuTienDamPhan from './MucDoUuTienDamPhan';

const StyledLabel = styled('span')(({ theme }) => ({
  ...theme.typography.body2,
  width: 150,
  flexShrink: 0,
  color: theme.palette.text.secondary,
}));

type Props = {
  hopDongDamPhan: IHopDongDamPhan;
};
const NoiDungGiaoViec = ({ hopDongDamPhan }: Props) => (
  <Stack spacing={2} sx={{ p: 3 }}>
    <Stack direction="row" spacing={2}>
      <Typography variant="subtitle2">Từ ngày {fDate(hopDongDamPhan.fromDate)}</Typography>
      <Typography variant="subtitle2">đến ngày {fDate(hopDongDamPhan.toDate)}</Typography>
    </Stack>
    <CardHeader
      sx={{ p: 0 }}
      disableTypography
      avatar={
        <CustomAvatar alt={hopDongDamPhan.nguoiGui?.email} name={hopDongDamPhan.nguoiGui?.email} />
      }
      title={
        <Link color="inherit" variant="subtitle2">
          {hopDongDamPhan.nguoiGui?.hoTen} {`<${hopDongDamPhan.nguoiGui.email}>`}
        </Link>
      }
      subheader={
        <Typography variant="caption" component="div" sx={{ color: 'text.secondary' }}>
          {fDateTime(hopDongDamPhan.createdAt)}
        </Typography>
      }
    />
    <Typography
      sx={{
        p: (theme) => theme.spacing(1, 1, 0, 0),
      }}
    >
      {hopDongDamPhan.ghiChu}
    </Typography>

    <Stack direction="row">
      <StyledLabel sx={{ height: 40, lineHeight: '40px', my: 0.5 }}>Thực hiện đàm phán</StyledLabel>

      <Stack direction="row" flexWrap="wrap" alignItems="center">
        {hopDongDamPhan.hopDongDamPhanNguoiNhanList.map((user) => (
          <Tooltip key={user.id} title={user.nguoiDung.email}>
            <CustomAvatar name={user.nguoiDung.email} sx={{ m: 0.5, width: 32, height: 32 }} />
          </Tooltip>
        ))}

        {/* <Tooltip title="Thêm người đàm phán">
            <IconButton
              // onClick={handleOpenContacts}
              sx={{
                p: 1,
                ml: 0.5,
                bgcolor: (theme) => alpha(theme.palette.grey[500], 0.08),
                border: (theme) => `dashed 1px ${theme.palette.divider}`,
              }}
            >
              <Iconify icon="eva:plus-fill" />
            </IconButton>
          </Tooltip> */}

        {/* <KanbanContactsDialog
            assignee={task.assignee}
            open={openContacts}
            onClose={handleCloseContacts}
          /> */}
      </Stack>
    </Stack>

    {/* Prioritize */}
    {hopDongDamPhan.mucDoUuTien && (
      <Stack direction="column" spacing={1}>
        <StyledLabel>Độ ưu tiên</StyledLabel>

        <MucDoUuTienDamPhan prioritize={hopDongDamPhan.mucDoUuTien} />
      </Stack>
    )}
  </Stack>
);

export default NoiDungGiaoViec;
