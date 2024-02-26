// @mui
import { TableCell, TableRow, Typography } from '@mui/material';
import { get, isNil } from 'lodash';
import { IHead } from 'src/@types/common';
import { IImportHopDong } from 'src/@types/hopdong';
import Iconify from 'src/components/iconify/Iconify';

import { fCurrencyVND } from 'src/utils/formatNumber';
import { fDate } from 'src/utils/formatTime';
// @types
// components

// ----------------------------------------------------------------------

type Props = {
  row: IImportHopDong;
  no: number;
  headLabel: IHead[];
  selected: boolean;
  onSelectRow?: VoidFunction;
};

//----------------------------------------------------------------

//----------------------------------------------------------------
export default function CheckImportHopDongTableRow({
  no,
  row,
  headLabel,
  selected,
  onSelectRow,
}: Props) {
  return (
    <TableRow hover selected={selected}>
      {/* <TableCell
        padding="checkbox"
        style={{
          position: 'sticky',
          left: 0,
          zIndex: 1,
          backgroundColor: 'white',
        }}
      >
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell> */}
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
        if (!isNil(cell.format)) {
          data = cell.format.replace('#value', data);
        }
        if (cell.id === 'tinhTrang') {
          if (!row.errors.message.length) {
            return (
              <TableCell
                id={cell.id}
                key={cell.id.toString() + cell.label.toString()}
                align={cell?.align || 'left'}
              >
                <Iconify
                  icon="eva:checkmark-circle-fill"
                  sx={{
                    width: 20,
                    height: 20,
                    color: 'success.main',
                  }}
                />
              </TableCell>
            );
          }
          return (
            <TableCell
              id={cell.id}
              key={cell.id.toString() + cell.label.toString()}
              align={cell?.align || 'left'}
            >
              <Iconify
                icon="eva:alert-circle-outline"
                sx={{
                  width: 20,
                  height: 20,
                  color: 'warning.main',
                }}
              />
            </TableCell>
          );
        }
        if (cell.id === 'chiTietLoi') {
          return (
            <TableCell
              id={cell.id}
              key={cell.id.toString() + cell.label.toString()}
              align={cell?.align || 'left'}
            >
              {row.errors.message.length > 0 &&
                row.errors.message.map((err, index) => (
                  <li key={`${index}-${err}`} style={{ color: '#B71D18' }}>
                    <span>{err}</span>
                    <br />
                  </li>
                ))}
            </TableCell>
          );
        }
        if (cell.id === 'dongSo') {
          return (
            <TableCell
              id={cell.id}
              key={cell.id.toString() + cell.label.toString()}
              align={cell?.align || 'left'}
              style={{
                position: 'sticky',
                left: 0,
                zIndex: 1,
                backgroundColor: 'white',
              }}
            >
              {data}
            </TableCell>
          );
        }
        if (cell.id === 'soHopDong') {
          return (
            <TableCell
              id={cell.id}
              key={cell.id.toString() + cell.label.toString()}
              align={cell?.align || 'left'}
              sx={{ bgcolor: `${row.soHopDong === '' && '#FFAB00'}` }}
            >
              <Typography
                component="span"
                variant="body2"
                sx={{ color: `${row.errors.status.soHopDong && '#FFAB00'}` }}
              >
                {data}
              </Typography>
            </TableCell>
          );
        }
        if (cell.id === 'soHopDongErp') {
          return (
            <TableCell
              id={cell.id}
              key={cell.id.toString() + cell.label.toString()}
              align={cell?.align || 'left'}
              // sx={{ bgcolor: `${row.soHopDongErp === '' && '#FFAB00'}` }}
            >
              <Typography
                component="span"
                variant="body2"
                sx={{ color: `${row.errors.status.soHopDongErp && '#FFAB00'}` }}
              >
                {data}
              </Typography>
            </TableCell>
          );
        }
        if (cell.id === 'maTram') {
          return (
            <TableCell
              id={cell.id}
              key={cell.id.toString() + cell.label.toString()}
              align={cell?.align || 'left'}
              sx={{ bgcolor: `${row.maTram === '' && '#FFAB00'}` }}
            >
              <Typography
                component="span"
                variant="body2"
                sx={{ color: `${row.errors.status.maTram && '#FFAB00'}` }}
              >
                {data}
              </Typography>
            </TableCell>
          );
        }
        if (cell.id === 'phongDai') {
          return (
            <TableCell
              id={cell.id}
              key={cell.id.toString() + cell.label.toString()}
              align={cell?.align || 'left'}
              sx={{ bgcolor: `${row.phongDai === '' && '#FFAB00'}` }}
            >
              <Typography
                component="span"
                variant="body2"
                sx={{ color: `${row.errors.status.phongDai && '#FFAB00'}` }}
              >
                {data}
              </Typography>
            </TableCell>
          );
        }
        if (cell.id === 'to') {
          return (
            <TableCell
              id={cell.id}
              key={cell.id.toString() + cell.label.toString()}
              align={cell?.align || 'left'}
            >
              <Typography
                component="span"
                variant="body2"
                sx={{ color: `${row.errors.status.to && '#FFAB00'}` }}
              >
                {data}
              </Typography>
            </TableCell>
          );
        }
        if (cell.id === 'tinh') {
          return (
            <TableCell
              id={cell.id}
              key={cell.id.toString() + cell.label.toString()}
              align={cell?.align || 'left'}
              sx={{ bgcolor: `${row.tinh === '' && '#FFAB00'}` }}
            >
              <Typography
                component="span"
                variant="body2"
                sx={{ color: `${row.errors.status.tinh && '#FFAB00'}` }}
              >
                {data}
              </Typography>
            </TableCell>
          );
        }
        if (cell.id === 'huyen') {
          return (
            <TableCell
              id={cell.id}
              key={cell.id.toString() + cell.label.toString()}
              align={cell?.align || 'left'}
            >
              <Typography
                component="span"
                variant="body2"
                sx={{ color: `${row.errors.status.huyen && '#FFAB00'}` }}
              >
                {data}
              </Typography>
            </TableCell>
          );
        }
        if (cell.id === 'xa') {
          return (
            <TableCell
              id={cell.id}
              key={cell.id.toString() + cell.label.toString()}
              align={cell?.align || 'left'}
            >
              <Typography
                component="span"
                variant="body2"
                sx={{ color: `${row.errors.status.xa && '#FFAB00'}` }}
              >
                {data}
              </Typography>
            </TableCell>
          );
        }
        if (cell.id === 'khuVuc') {
          return (
            <TableCell
              id={cell.id}
              key={cell.id.toString() + cell.label.toString()}
              align={cell?.align || 'left'}
            >
              <Typography
                component="span"
                variant="body2"
                sx={{ color: `${row.errors.status.khuVuc && '#FFAB00'}` }}
              >
                {data}
              </Typography>
            </TableCell>
          );
        }
        if (cell.id === 'loaiTram') {
          return (
            <TableCell
              id={cell.id}
              key={cell.id.toString() + cell.label.toString()}
              align={cell?.align || 'left'}
            >
              <Typography
                component="span"
                variant="body2"
                sx={{ color: `${row.errors.status.loaiTram && '#FFAB00'}` }}
              >
                {data}
              </Typography>
            </TableCell>
          );
        }
        if (cell.id === 'loaiCSHT') {
          return (
            <TableCell
              id={cell.id}
              key={cell.id.toString() + cell.label.toString()}
              align={cell?.align || 'left'}
            >
              <Typography
                component="span"
                variant="body2"
                sx={{ color: `${row.errors.status.loaiCsht && '#FFAB00'}` }}
              >
                {data}
              </Typography>
            </TableCell>
          );
        }
        if (cell.id === 'loaiThietBiRan') {
          return (
            <TableCell
              id={cell.id}
              key={cell.id.toString() + cell.label.toString()}
              align={cell?.align || 'left'}
            >
              <Typography
                component="span"
                variant="body2"
                sx={{ color: `${row.errors.status.loaiThietBiRan && '#FFAB00'}` }}
              >
                {data}
              </Typography>
            </TableCell>
          );
        }
        if (cell.id === 'loaiCotAnten') {
          return (
            <TableCell
              id={cell.id}
              key={cell.id.toString() + cell.label.toString()}
              align={cell?.align || 'left'}
            >
              <Typography
                component="span"
                variant="body2"
                sx={{ color: `${row.errors.status.loaiCotAnten && '#FFAB00'}` }}
              >
                {data}
              </Typography>
            </TableCell>
          );
        }
        if (cell.id === 'hinhThucKyHopDong') {
          return (
            <TableCell
              id={cell.id}
              key={cell.id.toString() + cell.label.toString()}
              align={cell?.align || 'left'}
            >
              <Typography
                component="span"
                variant="body2"
                sx={{ color: `${row.errors.status.hinhThucKyHopDong && '#FFAB00'}` }}
              >
                {data}
              </Typography>
            </TableCell>
          );
        }
        if (cell.id === 'hinhThucDauTu') {
          return (
            <TableCell
              id={cell.id}
              key={cell.id.toString() + cell.label.toString()}
              align={cell?.align || 'left'}
            >
              <Typography
                component="span"
                variant="body2"
                sx={{ color: `${row.errors.status.hinhThucDauTu && '#FFAB00'}` }}
              >
                {data}
              </Typography>
            </TableCell>
          );
        }
        if (cell.id === 'doiTuongKyHopDong') {
          return (
            <TableCell
              id={cell.id}
              key={cell.id.toString() + cell.label.toString()}
              align={cell?.align || 'left'}
            >
              <Typography
                component="span"
                variant="body2"
                sx={{ color: `${row.errors.status.doiTuongKyHopDong && '#FFAB00'}` }}
              >
                {data}
              </Typography>
            </TableCell>
          );
        }
        if (cell.id === 'hinhThucThanhToan') {
          return (
            <TableCell
              id={cell.id}
              key={cell.id.toString() + cell.label.toString()}
              align={cell?.align || 'left'}
            >
              <Typography
                component="span"
                variant="body2"
                sx={{ color: `${row.errors.status.hinhThucThanhToan && '#FFAB00'}` }}
              >
                {data}
              </Typography>
            </TableCell>
          );
        }
        if (cell.id === 'thueVAT') {
          const dataThue = row.thueVAT === '' ? null : data;
          return (
            <TableCell
              id={cell.id}
              key={cell.id.toString() + cell.label.toString()}
              align={cell?.align || 'left'}
            >
              <Typography
                component="span"
                variant="body2"
                sx={{ color: `${row.errors.status.thueVAT && '#FFAB00'}` }}
              >
                {dataThue}
              </Typography>
            </TableCell>
          );
        }
        if (cell.id === 'ngayKyHopDong') {
          return (
            <TableCell
              id={cell.id}
              key={cell.id.toString() + cell.label.toString()}
              align={cell?.align || 'left'}
              sx={{ bgcolor: `${row.ngayKyHopDong === '' && '#FFAB00'}` }}
            >
              <Typography
                component="span"
                variant="body2"
                sx={{ color: `${row.errors.status.ngayKyHopDong && '#FFAB00'}` }}
              >
                {data}
              </Typography>
            </TableCell>
          );
        }
        if (cell.id === 'ngayKetThucHopDong') {
          return (
            <TableCell
              id={cell.id}
              key={cell.id.toString() + cell.label.toString()}
              align={cell?.align || 'left'}
              sx={{ bgcolor: `${row.ngayKetThucHopDong === '' && '#FFAB00'}` }}
            >
              <Typography
                component="span"
                variant="body2"
                sx={{ color: `${row.errors.status.ngayKetThucHopDong && '#FFAB00'}` }}
              >
                {data}
              </Typography>
            </TableCell>
          );
        }
        if (cell.id === 'chuKyThanhToan') {
          return (
            <TableCell
              id={cell.id}
              key={cell.id.toString() + cell.label.toString()}
              align={cell?.align || 'left'}
              sx={{ bgcolor: `${row.chuKyThanhToan === '' && '#FFAB00'}` }}
            >
              <Typography
                component="span"
                variant="body2"
                sx={{ color: `${row.errors.status.chuKyThanhToan && '#FFAB00'}` }}
              >
                {data}
              </Typography>
            </TableCell>
          );
        }
        if (cell.id === 'ngayBatDauYeuCauThanhToan') {
          return (
            <TableCell
              id={cell.id}
              key={cell.id.toString() + cell.label.toString()}
              align={cell?.align || 'left'}
              sx={{ bgcolor: `${row.ngayBatDauYeuCauThanhToan === '' && '#FFAB00'}` }}
            >
              <Typography
                component="span"
                variant="body2"
                sx={{ color: `${row.errors.status.ngayBatDauYeuCauThanhToan && '#FFAB00'}` }}
              >
                {data}
              </Typography>
            </TableCell>
          );
        }
        if (cell.id === 'hoTenChuNha') {
          return (
            <TableCell
              id={cell.id}
              key={cell.id.toString() + cell.label.toString()}
              align={cell?.align || 'left'}
              sx={{ bgcolor: `${row.hoTenChuNha === '' && '#FFAB00'}` }}
            >
              <Typography
                component="span"
                variant="body2"
                sx={{ color: `${row.errors.status.hoTenChuNha && '#FFAB00'}` }}
              >
                {data}
              </Typography>
            </TableCell>
          );
        }
        if (cell.id === 'diaChiLienHe') {
          return (
            <TableCell
              id={cell.id}
              key={cell.id.toString() + cell.label.toString()}
              align={cell?.align || 'left'}
              sx={{ bgcolor: `${row.diaChiLienHe === '' && '#FFAB00'}` }}
            >
              <Typography
                component="span"
                variant="body2"
                sx={{ color: `${row.errors.status.diaChiLienHe && '#FFAB00'}` }}
              >
                {data}
              </Typography>
            </TableCell>
          );
        }
        if (cell.id === 'loaiHangMucCsht') {
          return (
            <TableCell
              id={cell.id}
              key={cell.id.toString() + cell.label.toString()}
              align={cell?.align || 'left'}
              sx={{ bgcolor: `${row.errors.status.loaiHangMucCsht && '#FFAB00'}` }}
            >
              <Typography
                component="span"
                variant="body2"
                sx={{ color: `${row.errors.status.loaiHangMucCsht && '#FFAB00'}` }}
              >
                {data}
              </Typography>
            </TableCell>
          );
        }
        if (cell.id === 'maTramDonViDungChung') {
          return (
            <TableCell
              id={cell.id}
              key={cell.id.toString() + cell.label.toString()}
              align={cell?.align || 'left'}
              sx={{ bgcolor: `${row.errors.status.maTramDonViDungChung && '#FFAB00'}` }}
            >
              <Typography
                component="span"
                variant="body2"
                sx={{ color: `${row.errors.status.maTramDonViDungChung && '#FFAB00'}` }}
              >
                {data}
              </Typography>
            </TableCell>
          );
        }
        if (cell.id === 'loaiPhongMay') {
          return (
            <TableCell
              id={cell.id}
              key={cell.id.toString() + cell.label.toString()}
              align={cell?.align || 'left'}
            >
              <Typography
                component="span"
                variant="body2"
                sx={{ color: `${row.errors.status.loaiPhongMay && '#FFAB00'}` }}
              >
                {data}
              </Typography>
            </TableCell>
          );
        }
        if (cell.id === 'loaiPhongMayPhatDien') {
          return (
            <TableCell
              id={cell.id}
              key={cell.id.toString() + cell.label.toString()}
              align={cell?.align || 'left'}
            >
              <Typography
                component="span"
                variant="body2"
                sx={{ color: `${row.errors.status.loaiPhongMayPhatDien && '#FFAB00'}` }}
              >
                {data}
              </Typography>
            </TableCell>
          );
        }
        if (cell.id === 'loaiTramVhkt') {
          return (
            <TableCell
              id={cell.id}
              key={cell.id.toString() + cell.label.toString()}
              align={cell?.align || 'left'}
            >
              <Typography
                component="span"
                variant="body2"
                sx={{ color: `${row.errors.status.loaiTramVhkt && '#FFAB00'}` }}
              >
                {data}
              </Typography>
            </TableCell>
          );
        }
        if (cell.id === 'khoanMuc') {
          return (
            <TableCell
              id={cell.id}
              key={cell.id.toString() + cell.label.toString()}
              align={cell?.align || 'left'}
            >
              <Typography
                component="span"
                variant="body2"
                sx={{ color: `${row.errors.status.khoanMuc && '#FFAB00'}` }}
              >
                {data}
              </Typography>
            </TableCell>
          );
        }
        if (cell.id === 'donViDungChung') {
          return (
            <TableCell
              id={cell.id}
              key={cell.id.toString() + cell.label.toString()}
              align={cell?.align || 'left'}
            >
              <Typography
                component="span"
                variant="body2"
                sx={{ color: `${row.errors.status.donViDungChung && '#FFAB00'}` }}
              >
                {data}
              </Typography>
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
  );
}
