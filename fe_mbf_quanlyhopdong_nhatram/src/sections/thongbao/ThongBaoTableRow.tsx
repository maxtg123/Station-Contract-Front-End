import { IconButton, Stack, TableCell, TableRow, Tooltip, Typography } from '@mui/material';
import get from 'lodash/get';
import isNil from 'lodash/isNil';
import isNull from 'lodash/isNull';
import { useRouter } from 'next/router';
import { IHead } from 'src/@types/common';
import { IModule, IThongBao } from 'src/@types/thongbao';
import { CustomAvatar } from 'src/components/custom-avatar';
import DialogWithRoute from 'src/components/dialogs/dialog-with-route/DialogWithRoute';
import Iconify from 'src/components/iconify/Iconify';
import { LabelColor } from 'src/components/label';
import Label from 'src/components/label/Label';
import {
  LABELS_MAP_ACTION,
  LABELS_MAP_MODULE,
  LABEL_COLORS_ACTION,
  TRANG_THAI_THONG_BAO,
} from 'src/constants/thongbao.constant';
import { useUpdateThongBaoMutation } from 'src/data/thongbao';
import { fDateTime } from 'src/utils/formatTime';
import { getMessageThongBao } from './GetMessageThongBao';

// ----------------------------------------------------------------------

type Props = {
  row: IThongBao;
  no: number;
  headLabel: IHead[];
};

export default function ThongBaoTableRow({ no, row, headLabel }: Props) {
  const parserData = JSON.parse(row.content);
  const router = useRouter();
  const { mutate: updateThongBaoDaXem } = useUpdateThongBaoMutation();
  const handleDialogClose = () => {
    const transfromData = {
      trangThai: TRANG_THAI_THONG_BAO.daXem,
    };
    if (row.trangThai === TRANG_THAI_THONG_BAO.chuaXem) {
      updateThongBaoDaXem({ id: row.id.toString(), ...transfromData });
    }
    router.push(router.pathname);
  };
  const handleDanhDauDaDocThongBao = () => {
    updateThongBaoDaXem({ id: row.id.toString(), trangThai: TRANG_THAI_THONG_BAO.daXem });
  };
  return (
    <>
      <TableRow hover>
        {headLabel.map((cell) => {
          let data = get(row, cell.value);
          if (!isNil(cell.type)) {
            switch (cell.type) {
              case 'Date':
                data = fDateTime(get(row, cell.value));
                break;

              default:
                data = get(row, cell.value);
                break;
            }
          }

          if (!isNil(cell.format)) {
            data = cell.format.replace('#value', data);
          }
          if (cell.id === 'trangThai') {
            const active = data === TRANG_THAI_THONG_BAO.daXem;
            return (
              <TableCell align="left" key={cell.id}>
                <Label
                  variant="soft"
                  color={(!active && 'error') || 'success'}
                  sx={{ textTransform: 'capitalize' }}
                >
                  {active ? 'Đã đọc' : 'Chưa đọc'}
                </Label>
              </TableCell>
            );
          }
          if (cell.id === 'module') {
            return (
              <TableCell align="left" key={cell.id}>
                {LABELS_MAP_MODULE[data] || data}
              </TableCell>
            );
          }
          if (cell.id === 'action') {
            const color: LabelColor = LABEL_COLORS_ACTION[data] as LabelColor;
            return (
              <TableCell align="left" key={cell.id}>
                <Label variant="outlined" color={color}>
                  {LABELS_MAP_ACTION[data] || data}
                </Label>
              </TableCell>
            );
          }
          if (cell.id === 'content') {
            const message = getMessageThongBao(row, row.module as IModule, router.pathname);
            return (
              <TableCell align="left" key={cell.id}>
                <Stack component="span">
                  <Typography variant="body2" component="span">
                    {message}
                  </Typography>
                </Stack>
              </TableCell>
            );
          }
          /**
           * * Nếu người gửi null thì sẽ mặt định là hệ thống
           */
          if (cell.id === 'nguoiGui') {
            if (isNull(data)) {
              return (
                <TableCell align="left" key={cell.id}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Tooltip title="System">
                      <CustomAvatar name="System" sx={{ width: 30, height: 30 }} />
                    </Tooltip>
                    <Typography variant="body2">System</Typography>
                  </Stack>
                </TableCell>
              );
            }
            return (
              <TableCell align="left" key={cell.id}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Tooltip title={data.hoTen}>
                    <CustomAvatar name={data.email} sx={{ width: 30, height: 30 }} />
                  </Tooltip>
                  <Typography variant="body2">{data.email}</Typography>
                </Stack>
              </TableCell>
            );
          }
          if (cell.id === 'nguoiNhan') {
            return (
              <TableCell align="left" key={cell.id}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Tooltip title={data.hoTen}>
                    <CustomAvatar name={data.email} sx={{ width: 30, height: 30 }} />
                  </Tooltip>
                  <Typography variant="body2">{data.email}</Typography>
                </Stack>
              </TableCell>
            );
          }
          if (cell.id === 'updatedAt') {
            const daXem = row.trangThai === TRANG_THAI_THONG_BAO.daXem;
            return (
              <TableCell align="left" key={cell.id}>
                {daXem && data}
              </TableCell>
            );
          }
          return (
            <TableCell
              id={cell.id}
              key={cell.id.toString() + cell.label.toString()}
              align={cell?.align || 'left'}
            >
              {data}
            </TableCell>
          );
        })}
        {row.trangThai === 'CHUA_XEM' ? (
          <TableCell align="center">
            <Tooltip title="Đánh dấu đã đọc">
              <IconButton color="primary" onClick={handleDanhDauDaDocThongBao}>
                <Iconify icon="ic:round-checklist-rtl" />
              </IconButton>
            </Tooltip>
          </TableCell>
        ) : (
          <TableCell />
        )}
      </TableRow>
      {parserData.data.id.toString() === (router.query.id as string) && (
        <DialogWithRoute
          open={!!router.query.id}
          onClose={handleDialogClose}
          onClick={handleDialogClose}
          title={`Thông tin chi tiết của hợp đồng: ${parserData.data.soHopDong}`}
        />
      )}
    </>
  );
}
