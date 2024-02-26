import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from '@mui/lab';
import { DialogContent, DialogTitle, Paper, Stack, Typography, alpha } from '@mui/material';
import isNull from 'lodash/isNull';
import { IHopDongTramList } from 'src/@types/hopdong';
import { DialogAnimate } from 'src/components/animate';
import { CustomAvatar } from 'src/components/custom-avatar';
import Label from 'src/components/label/Label';
import Scrollbar from 'src/components/scrollbar/Scrollbar';
import { fCurrencyVND } from 'src/utils/formatNumber';
import { fDate, fDateTime } from 'src/utils/formatTime';

type CustomColor =
  | 'primary'
  | 'success'
  | 'error'
  | 'info'
  | 'warning'
  | 'inherit'
  | 'grey'
  | 'secondary';

type TimelineType = {
  key: number;
  title: string;
  des: React.ReactElement;
  time?: string;
  thanhToanNgay: Date | number;
  daThanhToanNgay: Date | number | null;
  nguoiThanhToan: {
    hoTen: string;
    createdAt: Date | null;
    updatedAt: Date | null;
    email: string;
  };
  color: CustomColor;
  tien: number;
};

type Props = {
  open: boolean;
  onClose: VoidFunction;
  data: IHopDongTramList;
};
const COLORS: CustomColor[] = [
  'primary',
  'success',
  'error',
  'info',
  'warning',
  'inherit',
  'grey',
  'secondary',
];

const LichSuThanhToanDialog = ({ open, onClose, data }: Props) => {
  const handleClose = () => {
    onClose();
  };

  const kyThanhToans: TimelineType[] =
    data?.hopDongTramKyThanhToanList
      .map((ky, index) => ({
        key: ky.id,
        title: `Kỳ ${index + 1}: Từ ngày ${fDate(ky.tuNgay)} đến ngày ${fDate(ky.denNgay)}`,
        nguoiThanhToan: ky.nguoiThanhToan,
        soTienThanhToan: ky.soTienThanhToan,
        thanhToanNgay: ky.thanhToanNgay,
        daThanhToanNgay: ky.daThanhToanNgay,
        des:
          ky.daThanhToanNgay !== null ? (
            <Label color="success">Đã thanh toán</Label>
          ) : (
            <Label color="warning">Chưa thanh toán</Label>
          ),
        tien: ky.giaTien,
        color: COLORS[index % COLORS.length],
      }))
      .reverse() || [];
  const lastItem = kyThanhToans[kyThanhToans.length - 1]?.key;
  return (
    <DialogAnimate open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>Lịch sử thanh toán</DialogTitle>
      <Scrollbar sx={{ height: { md: 650 } }}>
        <DialogContent sx={{ p: 4, mb: 6 }}>
          <Timeline position="alternate">
            {kyThanhToans.map((item, index) => (
              <TimelineItem key={item.key}>
                <TimelineOppositeContent>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {item.time}
                  </Typography>
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot color={item.color} />
                  {lastItem === item.key ? null : <TimelineConnector />}
                </TimelineSeparator>
                <TimelineContent>
                  <Paper
                    sx={{
                      p: 2,
                      bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
                    }}
                  >
                    <Typography variant="subtitle2">{item.title}</Typography>
                    <Typography variant="subtitle2">
                      Số tiền: {fCurrencyVND(item.tien)} VNĐ
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 2 }}>
                      {item.des}
                    </Typography>
                    {!isNull(item.nguoiThanhToan) && (
                      <>
                        <Stack
                          direction="row"
                          spacing={2}
                          alignItems="flex-start"
                          justifyContent={index % 2 === 0 ? 'flex-start' : 'flex-end'}
                          my={2}
                        >
                          <CustomAvatar
                            name={item.nguoiThanhToan.email}
                            sx={{ width: 48, height: 48, marginRight: 0 }}
                          />
                          <Stack direction="column" spacing={0.5} textAlign="left">
                            <Typography variant="subtitle1" noWrap>
                              {item.nguoiThanhToan.hoTen}
                            </Typography>
                            <Typography variant="caption" noWrap>
                              {item.nguoiThanhToan.email}
                            </Typography>
                          </Stack>
                        </Stack>
                        {!isNull(item.daThanhToanNgay) && (
                          <Typography noWrap variant="body2" sx={{ display: 'block' }}>
                            Ngày thanh toán: {fDateTime(item.daThanhToanNgay)}
                          </Typography>
                        )}
                        <Typography noWrap variant="body2" sx={{ display: 'block' }}>
                          Số tiền thanh toán: {fCurrencyVND(item.tien)}
                        </Typography>
                      </>
                    )}
                  </Paper>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        </DialogContent>
      </Scrollbar>
    </DialogAnimate>
  );
};

export default LichSuThanhToanDialog;
