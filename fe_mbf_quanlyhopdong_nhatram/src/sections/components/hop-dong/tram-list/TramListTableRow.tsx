import { IconButton, MenuItem, TableCell, TableRow, Typography, Checkbox } from '@mui/material';
import { get, isNil, isNull } from 'lodash';
import { useState } from 'react';
import { IHead } from 'src/@types/common';
import { IHopDongKyThanhToan, IHopDongTramList } from 'src/@types/hopdong';
import { statusMappingsHopDong } from 'src/@types/thanhtoan';
import Iconify from 'src/components/iconify/Iconify';
import Label from 'src/components/label/Label';
import MenuPopover from 'src/components/menu-popover/MenuPopover';
import { fCurrencyVND } from 'src/utils/formatNumber';
import { fDate } from 'src/utils/formatTime';
import { getTinhTrangThanhToanOfHD } from 'src/utils/hopDongUtils';

// ----------------------------------------------------------------------

type Props = {
  row: IHopDongTramList;
  selected: boolean;
  onExportKyThanhToan?: VoidFunction;
  onViewPayments?: VoidFunction;
  no: number;
  headLabel: IHead[];
  onOpenChiTietTram?: VoidFunction;
  path?: 'DANH_SACH' | 'THANH_TOAN';
  onSelectRow?: VoidFunction;
};

//----------------------------------------------------------------
export default function TramListTableRow({
  no,
  row,
  selected,
  onExportKyThanhToan,
  headLabel,
  onOpenChiTietTram,
  onViewPayments,
  path,
  onSelectRow,
}: Props) {
  const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);

  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };
  return (
    <>
      <TableRow hover selected={selected}>
        {path === 'THANH_TOAN' && (
          <TableCell padding="checkbox">
            <Checkbox checked={selected} onClick={onSelectRow} />
          </TableCell>
        )}
        <TableCell align="left">{no}</TableCell>
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
          if (cell.id === 'tram.maTram' || cell.id === 'tram.maDauTuXayDung') {
            return (
              <TableCell align="left" key={cell.id}>
                <Typography
                  variant="body2"
                  sx={{ color: '#3366FF', cursor: 'pointer' }}
                  component="span"
                  onClick={() => onOpenChiTietTram?.()}
                >
                  {data}
                </Typography>
              </TableCell>
            );
          }
          if (cell.id === 'tram.trangThaiHoatDong') {
            const active = data === 'HOAT_DONG';
            return (
              <TableCell align="left" key={cell.id}>
                <Label
                  variant="soft"
                  color={(!active && 'error') || 'success'}
                  sx={{ textTransform: 'capitalize' }}
                >
                  {active ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                </Label>
              </TableCell>
            );
          }
          if (cell.id === 'hopDongTramDungChung' || cell.id === 'tram.daPhatSong') {
            let check = false;
            if (cell.id === 'hopDongTramDungChung') {
              check = !isNull(data);
            } else if (cell.id === 'tram.daPhatSong') {
              check = data;
            }
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
          if (cell.id === 'daThanhToanDenNgay' && !isNull(cell.value)) {
            const filteredData = data.filter(
              (item: IHopDongKyThanhToan) => item.daThanhToanNgay !== null
            );
            const lastItem = filteredData.length > 0 ? filteredData[filteredData.length - 1] : null;

            return (
              <TableCell align="left" key={cell.id}>
                <span>{lastItem ? fDate(lastItem.denNgay) : ''}</span>
              </TableCell>
            );
          }
          if (cell.id === 'tinhTrangThanhToan' && !isNull(cell.value)) {
            const kyThanhToan: IHopDongKyThanhToan = data.find(
              (item: IHopDongKyThanhToan) => item.daThanhToanNgay === null
            );
            if (!kyThanhToan) {
              const status = statusMappingsHopDong.DA_THANH_TOAN;
              return (
                <TableCell key={cell.id}>
                  <Label
                    variant="soft"
                    color={status.color}
                    sx={{ textTransform: 'capitalize' }}
                    startIcon={<Iconify icon={status.icon} />}
                  >
                    {status.label}
                  </Label>
                </TableCell>
              );
            }
            const dateKyThanhToan = {
              tuNgay: kyThanhToan.tuNgay,
              denNgay: kyThanhToan.denNgay,
            };
            const resultStatusHopDong = getTinhTrangThanhToanOfHD(dateKyThanhToan);
            const statusData =
              statusMappingsHopDong[resultStatusHopDong as keyof typeof statusMappingsHopDong];
            if (statusData) {
              return (
                <TableCell align="left" key={cell.id}>
                  <Label
                    variant="soft"
                    color={statusData.color}
                    sx={{ textTransform: 'capitalize' }}
                    startIcon={<Iconify icon={statusData.icon} />}
                  >
                    {statusData.label}
                  </Label>
                </TableCell>
              );
            }
            return <TableCell key={cell.id} />;
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

        <TableCell
          align="right"
          style={{
            position: 'sticky',
            right: 0,
            zIndex: 1,
            backgroundColor: 'white',
          }}
        >
          <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>
      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ minWidth: 140 }}
      >
        <MenuItem
          onClick={() => {
            onOpenChiTietTram?.();
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:eye-fill" />
          Xem chi tiết
        </MenuItem>
        <MenuItem
          onClick={() => {
            onExportKyThanhToan?.();
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:cloud-download-outline" />
          Xuất các kỳ thanh toán
        </MenuItem>
        <MenuItem
          onClick={() => {
            onViewPayments?.();
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:credit-card-outline" />
          Lịch sử thanh toán
        </MenuItem>
      </MenuPopover>
    </>
  );
}
