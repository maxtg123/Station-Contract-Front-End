import { Chip, Stack, TableCell, TableRow, Typography } from '@mui/material';
import { sortBy } from 'lodash';
import get from 'lodash/get';
import isNil from 'lodash/isNil';
import isNull from 'lodash/isNull';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { IHead } from 'src/@types/common';
import { IHopDongKyThanhToan, IHopDongPhuLuc } from 'src/@types/hopdong';
import { IHopDong } from 'src/@types/hopdongmatbang';
import Iconify from 'src/components/iconify/Iconify';
import Label from 'src/components/label/Label';
import { HOP_DONG_MAT_BANG } from 'src/constants/hopdongmatbang.constant';
import { fCurrencyVND } from 'src/utils/formatNumber';
import { fDate } from 'src/utils/formatTime';
import { transformTinhTrangHopDong } from 'src/utils/hopDongUtils';

const DialogWithRoute = dynamic(
  () => import('src/components/dialogs/dialog-with-route/DialogWithRoute'),
  { ssr: false }
);
// ----------------------------------------------------------------------

type Props = {
  row: IHopDong;
  no: number;
  headLabel: IHead[];
};

//----------------------------------------------------------------

//----------------------------------------------------------------
export default function ListHopDongTrongTramTableRow({ no, row, headLabel }: Props) {
  const router = useRouter();
  return (
    <>
      <TableRow hover>
        <TableCell>{no}</TableCell>
        {headLabel.map((cell) => {
          let data = get(row, cell.value);
          if (!isNil(cell.type)) {
            switch (cell.type) {
              case 'Date':
                data = fDate(get(row, cell.value));
                break;
              case 'Price':
                data = fCurrencyVND(get(row, cell.value));
                break;
              default:
                data = get(row, cell.value);
                break;
            }
          }
          if (!isNil(cell.format) && !isNil(data)) {
            data = cell.format.replace('#value', data);
          }
          if (cell.id === 'soHopDong' || cell.id === 'soHopDongErp') {
            return (
              <TableCell align="left" key={cell.id}>
                <Link
                  style={{ color: '#3366FF', textDecoration: 'none' }}
                  href={`${router.pathname}?id=${row.id}`}
                  as={`/${HOP_DONG_MAT_BANG}/${row.id}`}
                >
                  {data}
                </Link>
              </TableCell>
            );
          }
          if (cell.id === 'coKyQuy') {
            const check = data;
            return (
              <TableCell align={cell.align || 'left'} key={cell.id}>
                <Iconify
                  icon={check ? 'eva:checkmark-circle-fill' : 'eva:close-circle-outline'}
                  sx={{
                    width: 20,
                    height: 20,
                    color: 'success.main',
                    ...(!check && { color: 'error.main' }),
                  }}
                />
              </TableCell>
            );
          }
          if (cell.id === 'chuKyTT' && !isNull(cell.value)) {
            const cutStringValue = cell.value.split(',');
            const dataNam = get(row, cutStringValue[0]);
            const dataThang = get(row, cutStringValue[1]);
            const dataNgay = get(row, cutStringValue[2]);
            return (
              <TableCell align="left" key={cell.id}>
                <span>
                  {dataNam !== 0 && `${dataNam} năm `}
                  {dataThang !== 0 && `${dataThang} tháng `}
                  {dataNgay !== 0 && `${dataNgay} ngày `}
                </span>
              </TableCell>
            );
          }
          if (cell.id === 'kyThanhToanKeTiep' && !isNull(cell.value)) {
            const kyThanhToan: IHopDongKyThanhToan = data.find(
              (item: IHopDongKyThanhToan) => item.daThanhToanNgay === null
            );
            if (!kyThanhToan) {
              return <TableCell key={cell.id} />;
            }
            return (
              <TableCell align="left" key={cell.id}>
                <span>{`${fDate(kyThanhToan.tuNgay)} - ${fDate(kyThanhToan.denNgay)} `}</span>
              </TableCell>
            );
          }
          if (cell.id === 'thueVat') {
            const dataThue = row.thueVat === null ? '' : data;
            return (
              <TableCell
                id={cell.id}
                key={cell.id.toString() + cell.label.toString()}
                align={cell?.align || 'left'}
              >
                <Typography component="span" variant="body2">
                  {dataThue}
                </Typography>
              </TableCell>
            );
          }
          if (cell.id === 'hopDongPhuLucModels') {
            return (
              <TableCell align="center" key={cell.id}>
                <Stack direction="row" flexWrap="wrap" justifyContent="center">
                  {sortBy(data, ['ten']).map((phuLuc: IHopDongPhuLuc, i: number) => (
                    <Chip
                      size="small"
                      key={phuLuc.id}
                      label={phuLuc.soPhuLuc}
                      sx={{ mr: i === data.length - 1 ? 0 : 1, mb: 1, color: 'text.secondary' }}
                    />
                  ))}
                </Stack>
              </TableCell>
            );
          }
          if (cell.id === 'tinhTrangHopDong') {
            const { txt, color } = transformTinhTrangHopDong({ value: data });
            return (
              <TableCell
                id={cell.id}
                key={cell.id.toString() + cell.label.toString()}
                align={cell?.align || 'left'}
              >
                {data ? (
                  <Label variant="soft" color={color}>
                    {txt}
                  </Label>
                ) : (
                  ''
                )}
              </TableCell>
            );
          }
          if (cell.id === 'hopDongTramList') {
            const totalTramList = data.length;
            return (
              <TableCell
                id={cell.id}
                key={cell.id.toString() + cell.label.toString()}
                align="center"
              >
                <Label variant="soft" color="primary">
                  {totalTramList}
                </Label>
              </TableCell>
            );
          }
          return (
            <TableCell
              id={cell.id}
              key={cell.id.toString() + cell.label.toString()}
              align={cell?.align || 'left'}
            >
              <>{data}</>
            </TableCell>
          );
        })}
      </TableRow>

      {row.id.toString() === (router.query.id as string) && (
        <DialogWithRoute
          open={!!router.query.id}
          onClose={() => router.push(router.pathname)}
          onClick={() => router.push(router.pathname)}
          title={`Thông tin chi tiết của hợp đồng: ${row.soHopDong}`}
        />
      )}
    </>
  );
}
