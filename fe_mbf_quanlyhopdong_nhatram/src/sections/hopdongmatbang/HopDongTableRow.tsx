import { LoadingButton } from '@mui/lab';
import {
  Checkbox,
  Chip,
  Collapse,
  Divider,
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
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { IHead } from 'src/@types/common';
import { IHopDongKyThanhToan, IHopDongPhuLuc } from 'src/@types/hopdong';
import { IHopDong } from 'src/@types/hopdongmatbang';
import ConfirmDialog from 'src/components/confirm-dialog/ConfirmDialog';
import Iconify from 'src/components/iconify/Iconify';
import Label from 'src/components/label/Label';
import MenuPopover from 'src/components/menu-popover/MenuPopover';
import PermissionWrapper from 'src/components/permission-wrapper';
import { HOP_DONG_MAT_BANG } from 'src/constants/hopdongmatbang.constant';
import { useDeleteHopDongNhapMutation } from 'src/data/hopDongMatBang';
import { fCurrencyVND } from 'src/utils/formatNumber';
import { fDate } from 'src/utils/formatTime';
import { transformTinhTrangHopDong } from 'src/utils/hopDongUtils';
import TramList from '../components/hop-dong/tram-list/TramList';
import ThanhToanTramList from './thanhtoan/ThanhToanTramList';

const DialogWithRoute = dynamic(
  () => import('src/components/dialogs/dialog-with-route/DialogWithRoute'),
  { ssr: false }
);
// ----------------------------------------------------------------------

type Props = {
  row: IHopDong;
  selected: boolean;
  onEditRow: VoidFunction;
  onDetailRow: VoidFunction;
  onSelectRow?: VoidFunction;
  onGuiPheDuyetHopDong?: VoidFunction;
  onGiaoViecDialog?: VoidFunction;
  no: number;
  headLabel: IHead[];
  module?: 'GIAO_VIEC' | 'HOP_DONG' | 'THANH_TOAN';
  type?: 'active' | 'draft';
  onSelectedTram?: (contractId: string, tramId: string[]) => void;
};

//----------------------------------------------------------------

//----------------------------------------------------------------
export default function HopDongTableRow({
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
  type,
  onSelectedTram,
}: Props) {
  const router = useRouter();
  const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);

  const [open, setOpen] = useState(false);

  const [openConfirm, setOpenConfirm] = useState(false);

  const { mutate: deleteHopDongNhap, isLoading: deleting } = useDeleteHopDongNhapMutation();

  const { enqueueSnackbar } = useSnackbar();

  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleDeleteHopDongNhap = () => {
    if (row.id) {
      deleteHopDongNhap(row.id.toString(), {
        onSuccess: (data) => {
          enqueueSnackbar(`Xoá hợp đồng nháp "${row.soHopDong}" thành công`, {
            variant: 'success',
          });
          handleCloseConfirm();
        },
        onError: () => {
          enqueueSnackbar(`Có lỗi trong quá trình xoá hợp đồng nháp`, {
            variant: 'error',
          });
          handleCloseConfirm();
        },
      });
    }
  };
  const renderAction = () => {
    if (row.trangThaiHopDong === 'NHAP' || row.trangThaiHopDong === 'CHO_PHE_DUYET_HOP_DONG') {
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
              as={`/${HOP_DONG_MAT_BANG}/${row.id}`}
              onClick={() => {
                handleClosePopover();
              }}
            >
              Xem chi tiết
            </Link>
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
          {row.trangThaiHopDong === 'NHAP' && (
            <>
              <Divider sx={{ borderStyle: 'dashed' }} />
              <MenuItem
                onClick={() => {
                  handleOpenConfirm();
                  handleClosePopover();
                }}
                sx={{ color: 'error.main' }}
              >
                <Iconify icon="eva:trash-2-outline" />
                Xóa
              </MenuItem>
            </>
          )}
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
              as={`/${HOP_DONG_MAT_BANG}/${row.id}`}
              onClick={() => {
                handleClosePopover();
              }}
            >
              Xem chi tiết hợp đồng
            </Link>
          </MenuItem>
          <PermissionWrapper module="DAM_PHAN" action="GIAO_VIEC" hideWhenBlocked checkAt="pdChinh">
            {row.hopDongDamPhanList?.length > 0 &&
            row.hopDongDamPhanList[0].trangThaiDamPhanMoiNhat !== 'PHE_DUYET' ? (
              // eslint-disable-next-line react/jsx-no-useless-fragment
              <></>
            ) : (
              <MenuItem
                onClick={() => {
                  onGiaoViecDialog?.();
                  handleClosePopover();
                }}
              >
                <Iconify icon="eva:shopping-bag-outline" />
                Giao việc
              </MenuItem>
            )}
          </PermissionWrapper>
        </MenuPopover>
      );
    }

    if (row.trangThaiHopDong === 'HOAT_DONG') {
      return (
        <MenuPopover
          open={openPopover}
          onClose={handleClosePopover}
          arrow="right-top"
          sx={{ minWidth: 140 }}
        >
          <MenuItem
            onClick={() => {
              onEditRow();
              handleClosePopover();
            }}
          >
            <Iconify icon="eva:edit-fill" />
            Chỉnh sửa
          </MenuItem>
          <MenuItem>
            <Link
              style={{
                color: '#000',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
              }}
              href={`${router.pathname}?id=${row.id}`}
              as={`/${HOP_DONG_MAT_BANG}/${row.id}`}
              onClick={() => {
                handleClosePopover();
              }}
            >
              <Iconify icon="eva:eye-outline" />
              Xem chi tiết
            </Link>
          </MenuItem>
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
        <MenuItem>
          <Link
            style={{ color: '#000', textDecoration: 'none', display: 'flex', alignItems: 'center' }}
            href={`${router.pathname}?id=${row.id}`}
            as={`/${HOP_DONG_MAT_BANG}/${row.id}`}
            onClick={() => {
              handleClosePopover();
            }}
          >
            <Iconify icon="eva:eye-outline" />
            Xem chi tiết
          </Link>
        </MenuItem>
      </MenuPopover>
    );
  };
  const handleSelectTram = (tramId: string[]) => {
    const selectedTramIds = tramId; // Có thể có nhiều trạm được chọn, ở đây chỉ ví dụ với một trạm

    // Gọi hàm onSelectedTram và truyền contractId và selectedTramIds
    onSelectedTram?.(row.id.toString(), selectedTramIds);
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
              {type === 'active' && module === 'HOP_DONG' ? (
                <ThanhToanTramList data={row.hopDongTramList} onSelectedTram={handleSelectTram} />
              ) : (
                <TramList data={row.hopDongTramList} />
              )}
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
      {openConfirm && (
        <ConfirmDialog
          open={openConfirm}
          onClose={handleCloseConfirm}
          title="Xóa"
          content={`Bạn có chắc chắn muốn xóa hợp đồng nháp ${row.soHopDong}?`}
          action={
            <LoadingButton
              variant="contained"
              type="button"
              color="error"
              loading={deleting}
              onClick={handleDeleteHopDongNhap}
            >
              Xóa
            </LoadingButton>
          }
        />
      )}
    </>
  );
}
