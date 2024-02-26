import {
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
import get from 'lodash/get';
import isNil from 'lodash/isNil';
import sortBy from 'lodash/sortBy';
import dynamic from 'next/dynamic';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { IHead } from 'src/@types/common';
import { IHopDongPhuLuc } from 'src/@types/hopdong';
import { IHopDongXaHoiHoa } from 'src/@types/hopdongxahoihoa';
import Iconify from 'src/components/iconify/Iconify';
import Label from 'src/components/label/Label';
import MenuPopover from 'src/components/menu-popover/MenuPopover';
import { HOP_DONG_MAT_BANG } from 'src/constants/hopdongmatbang.constant';
import TramList from 'src/sections/components/hop-dong/tram-list/TramList';
import { fCurrencyVND } from 'src/utils/formatNumber';
import { fDate } from 'src/utils/formatTime';
import { getTrangThaiPheDuyet } from 'src/utils/hopDongPheDuyetUtils';

const DialogWithRoute = dynamic(
  () => import('src/components/dialogs/dialog-with-route/DialogWithRoute'),
  { ssr: false }
);

type Props = {
  row: IHopDongXaHoiHoa;
  selected: boolean;
  headLabel: IHead[];
};

const Row = ({ row, selected, headLabel }: Props) => {
  const { id, soHopDong, hopDongPheDuyetList } = row;
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
    router.push(`/${HOP_DONG_MAT_BANG}?id=${id}`);
    handleClosePopover();
  };

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell>
          <IconButton
            size="small"
            color={open ? 'inherit' : 'default'}
            onClick={() => setOpen(!open)}
          >
            <Iconify icon={open ? 'eva:minus-fill' : 'eva:plus-fill'} />
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
          if (!isNil(cell.format)) {
            data = cell.format.replace('#value', data);
          }
          if (cell.id === 'soHopDong' || cell.id === 'soHopDongErp') {
            return (
              <TableCell align="left" key={cell.id}>
                <NextLink
                  style={{ color: '#3366FF', textDecoration: 'none' }}
                  href={`/${HOP_DONG_MAT_BANG}?id=${id}`}
                  as={`/${HOP_DONG_MAT_BANG}/${id}`}
                >
                  {data}
                </NextLink>
              </TableCell>
            );
          }

          // Lấy phê duyệt gần nhất lên đầu
          const pheDuyetList = sortBy(hopDongPheDuyetList || [], ['createdAt']).reverse();
          if (cell.id === 'hopDongPheDuyetList.nguoiGui') {
            return (
              <TableCell align="left" key={cell.id}>
                {pheDuyetList.length > 0 ? pheDuyetList[0].nguoiGui.email : ''}
              </TableCell>
            );
          }
          if (cell.id === 'hopDongPheDuyetList.ngayGui') {
            return (
              <TableCell align="left" key={cell.id}>
                {pheDuyetList.length > 0
                  ? fDate(pheDuyetList[pheDuyetList.length - 1].createdAt)
                  : ''}
              </TableCell>
            );
          }
          if (cell.id === 'hopDongPheDuyetList.nguoiPheDuyet') {
            return (
              <TableCell align="left" key={cell.id}>
                {pheDuyetList.length > 0
                  ? pheDuyetList[0].hopDongPheDuyetTienTrinhList?.[0]?.nguoiDung?.email
                  : ''}
              </TableCell>
            );
          }
          if (cell.id === 'hopDongPheDuyetList.trangThai') {
            return (
              <TableCell align="left" key={cell.id}>
                {pheDuyetList.length > 0 ? (
                  <Label
                    variant="soft"
                    color={getTrangThaiPheDuyet(pheDuyetList[0].trangThaiPheDuyetMoiNhat).color}
                    sx={{ textTransform: 'capitalize' }}
                  >
                    {getTrangThaiPheDuyet(pheDuyetList[0].trangThaiPheDuyetMoiNhat).text}
                  </Label>
                ) : (
                  ''
                )}
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
        <TableCell sx={{ py: 1 }} colSpan={12}>
          <Collapse in={open} unmountOnExit>
            <Paper
              variant="outlined"
              sx={{
                pt: 2,
                borderRadius: 1.5,
                ...(open && {
                  boxShadow: (theme) => theme.customShadows.z20,
                }),
              }}
            >
              <Typography variant="h6" sx={{ m: 2, mt: 0 }}>
                Danh sách trạm
              </Typography>
              <TramList data={row.hopDongTramList} />
            </Paper>
          </Collapse>
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
            handleViewDetail();
          }}
        >
          <Iconify icon="eva:eye-outline" />
          Xem chi tiết
        </MenuItem>
      </MenuPopover>
      {id.toString() === (router.query.id as string) && (
        <DialogWithRoute
          open={!!router.query.id}
          onClose={() => router.push(router.pathname)}
          onClick={() => router.push(router.pathname)}
          title={`Thông tin chi tiết của hợp đồng: ${soHopDong}`}
        />
      )}
    </>
  );
};

export default Row;
