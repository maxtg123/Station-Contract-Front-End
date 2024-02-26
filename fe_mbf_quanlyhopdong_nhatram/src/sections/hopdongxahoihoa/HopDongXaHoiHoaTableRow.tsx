import {
  Checkbox,
  Chip,
  Collapse,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
import { sortBy } from 'lodash';
import get from 'lodash/get';
import isNil from 'lodash/isNil';
import isNull from 'lodash/isNull';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { IHead } from 'src/@types/common';
import { IHopDongPhuLuc } from 'src/@types/hopdong';
import { IHopDongXaHoiHoa } from 'src/@types/hopdongxahoihoa';
import Iconify from 'src/components/iconify/Iconify';
import MenuPopover from 'src/components/menu-popover/MenuPopover';
import PermissionWrapper from 'src/components/permission-wrapper';
import { HOP_DONG_XA_HOI_HOA } from 'src/constants/hopdongxahoihoa.constant';
import { fCurrencyVND } from 'src/utils/formatNumber';
import { fDate } from 'src/utils/formatTime';
import TramList from '../components/hop-dong/tram-list/TramList';

const DialogWithRoute = dynamic(
  () => import('src/components/dialogs/dialog-with-route/DialogWithRoute'),
  { ssr: false }
);
// ----------------------------------------------------------------------

type Props = {
  row: IHopDongXaHoiHoa;
  selected: boolean;
  onEditRow: VoidFunction;
  onDetailRow: VoidFunction;
  onSelectRow?: VoidFunction;
  onGuiPheDuyetHopDong?: VoidFunction;
  onGiaoViecDialog?: VoidFunction;
  no: number;
  headLabel: IHead[];
  module?: 'GIAO_VIEC' | 'HOP_DONG' | 'THANH_TOAN';
};

//----------------------------------------------------------------

//----------------------------------------------------------------
export default function HopDongXaHoiHoaTableRow({
  no,
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDetailRow,
  onGuiPheDuyetHopDong,
  onGiaoViecDialog,
  headLabel,
  module,
}: Props) {
  const router = useRouter();
  const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);

  const [open, setOpen] = useState(false);

  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const handleViewDetail = () => {
    router.push(`/${HOP_DONG_XA_HOI_HOA}?id=${row.id}`);
    handleClosePopover();
  };
  /**
   * TODO need check status hop dong when send to phe_duyet, rejected, and approved
   */
  const renderAction = () => {
    if (row.trangThaiHopDong === 'NHAP' || row.trangThaiHopDong === 'CHO_PHE_DUYET_HOP_DONG') {
      return (
        <MenuPopover
          open={openPopover}
          onClose={handleClosePopover}
          arrow="right-top"
          sx={{ minWidth: 140 }}
        >
          <MenuItem
            onClick={() => {
              handleViewDetail();
            }}
          >
            <Iconify icon="eva:eye-outline" />
            Xem chi tiết
          </MenuItem>
          <MenuItem
            onClick={() => {
              onEditRow();
              handleClosePopover();
            }}
          >
            <Iconify icon="eva:edit-fill" />
            Chỉnh sửa
          </MenuItem>
          <MenuItem
            onClick={() => {
              onGuiPheDuyetHopDong?.();
              handleClosePopover();
            }}
          >
            <Iconify icon="eva:checkmark-circle-fill" />
            Gửi phê duyệt
          </MenuItem>
        </MenuPopover>
      );
    }
    if (module === 'GIAO_VIEC') {
      return (
        <MenuPopover
          open={openPopover}
          onClose={handleClosePopover}
          arrow="right-top"
          sx={{ minWidth: 140 }}
        >
          <MenuItem>
            <Iconify icon="eva:eye-outline" />
            <Link
              style={{ color: '#000', textDecoration: 'none' }}
              href={`${router.pathname}?id=${row.id}`}
              as={`/${HOP_DONG_XA_HOI_HOA}/${row.id}`}
              onClick={() => {
                handleClosePopover();
              }}
            >
              Xem chi tiết hợp đồng
            </Link>
          </MenuItem>
          <PermissionWrapper
            module="DAM_PHAN"
            action="GIAO_VIEC"
            hideWhenBlocked
            checkAt="atLeastPD"
          >
            <MenuItem
              onClick={() => {
                onGiaoViecDialog?.();
                handleClosePopover();
              }}
            >
              <Iconify icon="eva:shopping-bag-outline" />
              Giao việc
            </MenuItem>
          </PermissionWrapper>
        </MenuPopover>
      );
    }
    return (
      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ minWidth: 140 }}
      >
        <MenuItem
          onClick={() => {
            handleViewDetail();
          }}
        >
          <Iconify icon="eva:eye-outline" />
          Xem chi tiết
        </MenuItem>
        <MenuItem
          onClick={() => {
            onDetailRow();
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:eye-fill" />
          Xem chi tiết hợp đồng
        </MenuItem>
      </MenuPopover>
    );
  };

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell
          padding="checkbox"
          style={{
            position: 'sticky',
            left: 0,
            zIndex: 1,
            backgroundColor: 'white',
          }}
        >
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>
        <TableCell>
          <IconButton
            size="small"
            color={open ? 'inherit' : 'default'}
            onClick={() => setOpen(!open)}
          >
            <Iconify icon={open ? 'eva:arrow-ios-downward-fill' : 'eva:arrow-ios-upward-fill'} />
          </IconButton>
        </TableCell>
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
                  as={`/${HOP_DONG_XA_HOI_HOA}/${row.id}`}
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
      <TableRow>
        <TableCell
          sx={{
            py: 0,
            pl: 8,
            bgcolor: '#F4F6F8',
          }}
          colSpan={100}
        >
          <Collapse in={open} unmountOnExit orientation="vertical">
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                borderRadius: 1.5,
                ...(open && {
                  mt: 1,
                  mb: 1,
                }),
              }}
            >
              <TramList data={row.hopDongTramList} />
            </Paper>
          </Collapse>
        </TableCell>
      </TableRow>
      {renderAction()}

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
