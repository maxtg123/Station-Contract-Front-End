import { Box, Card, CardHeader, Link, Paper, Stack, Typography } from '@mui/material';
import groupBy from 'lodash/groupBy';
import isNil from 'lodash/isNil';
import dynamic from 'next/dynamic';
import { IHopDongDamPhanTienTrinh, IHopDongTienTrinhChange } from 'src/@types/damphan';
import { CustomAvatar } from 'src/components/custom-avatar';
import Label from 'src/components/label/Label';
import { useChiTietHopDongContext } from 'src/context/hop-dong/chitietHopDongContext';
import { fDateTime } from 'src/utils/formatTime';
import TableNoiDungDamPhan from './TableNoiDungDamPhan';
import XetDuyet from './actions/xet-duyet/XetDuyet';

const TableFiles = dynamic(() => import('./tables/files/TableFiles'));

type Props = {
  data: IHopDongDamPhanTienTrinh[];
  damPhanId: number;
  isNguoiGiaoViec: boolean;
};

const CacLanDamPhan = ({ data = [], damPhanId, isNguoiGiaoViec }: Props) => {
  const {
    state: { hopDong },
  } = useChiTietHopDongContext();

  if (!hopDong) return null;

  return (
    <>
      {data.map((dt, index) => {
        const changedHopDong: IHopDongTienTrinhChange[] =
          dt.hopDongDamPhanTienTrinhChanges?.filter((c) => !c.tramId) || [];
        const tramIds = Object.keys(
          groupBy(
            dt.hopDongDamPhanTienTrinhChanges?.filter((c) => c.tramId),
            'tramId'
          )
        );
        return (
          <Card key={dt.id}>
            <CardHeader title={`Nội dung đàm phán lần thứ ${data.length - index}`} />
            <CardHeader
              disableTypography
              avatar={<CustomAvatar alt={dt.nguoiDung?.email} name={dt.nguoiDung?.email} />}
              title={
                <Link color="inherit" variant="subtitle2">
                  {dt.nguoiDung?.hoTen} {`<${dt.nguoiDung.email}>`}
                </Link>
              }
              subheader={
                <Typography variant="caption" component="div" sx={{ color: 'text.secondary' }}>
                  {fDateTime(dt.createdAt)}
                </Typography>
              }
            />
            <Typography
              sx={{
                p: (theme) => theme.spacing(2, 1, 2, 3),
              }}
            >
              {dt.ghiChu}
            </Typography>

            <Box>
              <Stack spacing={2}>
                {changedHopDong && changedHopDong.length > 0 && (
                  <TableNoiDungDamPhan changes={changedHopDong} tramId={null} />
                )}
                {tramIds.length > 0 &&
                  tramIds.map((tramId) => {
                    const changedByTram = dt.hopDongDamPhanTienTrinhChanges?.filter(
                      (c) => c.tramId && c.tramId === Number(tramId)
                    );
                    if (!changedByTram || changedByTram.length === 0) return null;
                    return (
                      <TableNoiDungDamPhan
                        key={tramId}
                        changes={changedByTram}
                        tramId={Number(tramId)}
                      />
                    );
                  })}

                {!isNil(dt.hopDongDamPhanFiles) && dt.hopDongDamPhanFiles.length > 0 && (
                  <TableFiles data={dt.hopDongDamPhanFiles} />
                )}
              </Stack>
            </Box>

            <Box sx={{ p: 2 }}>
              {dt.hopDongDamPhanTienTrinhXetDuyets &&
                dt.hopDongDamPhanTienTrinhXetDuyets.length > 0 &&
                dt.hopDongDamPhanTienTrinhXetDuyets.map((xd) => (
                  <Stack key={xd.id} direction="row" spacing={2}>
                    <CustomAvatar alt={xd.nguoiDung.email} name={xd.nguoiDung.email} />

                    <Paper
                      sx={{
                        p: 1.5,
                        flexGrow: 1,
                        bgcolor: 'background.neutral',
                      }}
                    >
                      <Stack
                        justifyContent="space-between"
                        direction={{ xs: 'column', sm: 'row' }}
                        alignItems={{ sm: 'center' }}
                        sx={{ mb: 0.5 }}
                      >
                        <Stack direction="row" spacing={2}>
                          <Typography variant="subtitle2">{`${xd.nguoiDung.hoTen} <${xd.nguoiDung.email}>`}</Typography>
                          <Label
                            color={xd.trangThai === 'TU_CHOI' ? 'error' : 'success'}
                            sx={{ mr: 1 }}
                          >
                            {xd.trangThai === 'TU_CHOI' ? 'từ chối' : 'phê duyệt'}
                          </Label>
                        </Stack>

                        <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                          {fDateTime(xd.createdAt)}
                        </Typography>
                      </Stack>

                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {xd.ghiChu}
                      </Typography>
                    </Paper>
                  </Stack>
                ))}

              {isNguoiGiaoViec && dt.trangThai === 'GUI_NOI_DUNG_DAM_PHAN' && (
                <XetDuyet hopDongId={hopDong.id} hopDongDamPhanId={damPhanId} tienTrinhId={dt.id} />
              )}
            </Box>
          </Card>
        );
      })}
    </>
  );
};

export default CacLanDamPhan;
