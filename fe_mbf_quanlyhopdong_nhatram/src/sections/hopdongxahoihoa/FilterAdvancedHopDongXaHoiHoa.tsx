import {
  Autocomplete,
  Box,
  Divider,
  Drawer,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { DatePicker } from '@mui/x-date-pickers';
import equal from 'fast-deep-equal';
import { useEffect, useState } from 'react';
import { OptionTypeTram } from 'src/@types/common';
import Iconify from 'src/components/iconify/Iconify';
import Scrollbar from 'src/components/scrollbar/Scrollbar';
import { useHopDongXaHoiHoaFilterContext } from 'src/context/hop-dong-xa-hoi-hoa/hopDongXaHoiHoaFilterContext';
import { useDmDoiTuongKyHopDongsQuery } from 'src/data/dmDoiTuongKyHopDong';
import { useDmHinhThucDauTusQuery } from 'src/data/dmHinhThucDauTu';
import { useDmHinhThucKyHopDongsQuery } from 'src/data/dmHinhThucKyHopDong';
import { useDmHuyensQuery } from 'src/data/dmHuyen';
import { useDmPhongDaisQuery } from 'src/data/dmPhongDai';
import { useDmTinhsQuery } from 'src/data/dmTinh';
import { useDmXasQuery } from 'src/data/dmXa';
import { useTramsQuery } from 'src/data/tram';
import { getAuthCredentials } from 'src/utils/authUtils';
// import TinhTrangThanhToanField from './fields/TinhTrangThanhToanField';

type Props = {
  open: boolean;
  onClose: VoidFunction;
  title: string;
};
const WIDTH_DRAWER = 360;
const SPACING = 2.5;
const DEFAULT_TINH = 1;
const DEFAULT_HUYEN = 1;
export default function FilterAdvancedHopDongXaHoiHoa({ open, onClose, title }: Props) {
  const theme = useTheme();
  const {
    state: { filterFormFields },
    dispatch,
  } = useHopDongXaHoiHoaFilterContext();
  const { data: dataMaTram } = useTramsQuery(
    { size: undefined, page: undefined, responseType: 0 },
    { refetchOnWindowFocus: false }
  );
  const [idTinhSelected, setIdTinhSelected] = useState(DEFAULT_TINH);
  const [idHuyenSelected, setIdHuyenSelected] = useState(DEFAULT_HUYEN);
  const [idPhongDaiSelected, setIdPhongDaiSelected] = useState(0);
  const [pdOptions, setPdOptions] = useState<OptionTypeTram[]>([]);
  const [huyenOptions, setHuyenOptions] = useState<OptionTypeTram[]>([]);

  const [xaOptions, setXaOptions] = useState<OptionTypeTram[]>([]);
  const { data: dataHinhThucDauTu } = useDmHinhThucDauTusQuery({ refetchOnWindowFocus: false });
  const { data: dataHinhThucKyHopDong } = useDmHinhThucKyHopDongsQuery({
    refetchOnWindowFocus: false,
  });
  const { data: dataDoiTuongKyHopDong } = useDmDoiTuongKyHopDongsQuery({
    refetchOnWindowFocus: false,
  });
  const { data: listDataTinh } = useDmTinhsQuery({ refetchOnWindowFocus: false });
  const { data: listDataHuyen } = useDmHuyensQuery(Number(idTinhSelected) || DEFAULT_TINH, {
    refetchOnWindowFocus: false,
  });
  const { data: listDataXa } = useDmXasQuery(Number(idHuyenSelected) || DEFAULT_HUYEN, {
    refetchOnWindowFocus: false,
  });
  const { data: listDataPhongDai } = useDmPhongDaisQuery({ refetchOnWindowFocus: false });
  const handleResetFilter = () => {
    dispatch({ type: 'reset-form-filter' });
  };
  useEffect(() => {
    let newHuyenOptions: OptionTypeTram[] = [];
    if (listDataHuyen && idTinhSelected !== 1) {
      newHuyenOptions = listDataHuyen.elements.map((huyen) => ({
        id: huyen.id.toString(),
        ten: huyen.ten,
      }));
    }
    if (!equal(huyenOptions, newHuyenOptions)) {
      setHuyenOptions(newHuyenOptions);
    }
  }, [huyenOptions, idTinhSelected, listDataHuyen]);

  useEffect(() => {
    let newXaOptions: OptionTypeTram[] = [];
    if (listDataXa && idHuyenSelected !== 1) {
      newXaOptions = listDataXa.elements.map((huyen) => ({
        id: huyen.id.toString(),
        ten: huyen.ten,
      }));
    }
    if (!equal(xaOptions, newXaOptions)) {
      setXaOptions(newXaOptions);
    }
  }, [idHuyenSelected, listDataXa, xaOptions]);

  // set pd option
  useEffect(() => {
    const { profile } = getAuthCredentials();
    let newPdOptions: OptionTypeTram[] = [];
    if (listDataPhongDai) {
      if (profile?.email === 'superadmin@mobifone.vn') {
        newPdOptions = listDataPhongDai.elements.map((pd) => ({
          id: pd.id.toString(),
          ten: pd.ten,
        }));
      } else {
        newPdOptions = listDataPhongDai.elements
          .filter((pd) =>
            profile?.nguoiDungKhuVucList
              ? profile?.nguoiDungKhuVucList.filter((kv) => kv?.dmPhongDai?.id === pd.id)?.length >
                0
              : false
          )
          .map((pd) => ({ id: pd.id.toString(), ten: pd.ten }));
      }
    }
    if (!equal(pdOptions, newPdOptions)) {
      setPdOptions(newPdOptions);
    }
  }, [listDataPhongDai, pdOptions]);
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      BackdropProps={{ invisible: true }}
      PaperProps={{
        sx: {
          width: WIDTH_DRAWER,
          boxShadow: `-24px 12px 40px 0 ${alpha(
            theme.palette.mode === 'light' ? theme.palette.grey[500] : theme.palette.common.black,
            0.16
          )}`,
        },
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ py: 2, pr: 1, pl: SPACING }}
      >
        <Typography variant="subtitle1" sx={{ flexGrow: 1, color: '#00B8D9' }}>
          {title}
        </Typography>
        <Tooltip title="Làm mới">
          <Box sx={{ position: 'relative' }}>
            <IconButton onClick={() => handleResetFilter()}>
              <Iconify icon="ic:round-refresh" />
            </IconButton>
          </Box>
        </Tooltip>
        <IconButton onClick={onClose}>
          <Iconify icon="eva:close-fill" />
        </IconButton>
      </Stack>
      <Divider sx={{ borderStyle: 'dashed' }} />
      <Scrollbar sx={{ p: SPACING, pb: 0 }}>
        {/* <Stack direction="column" mb={2} spacing={3}>
          <DatePicker
            value={filterFormFields.from}
            label="Từ ngày"
            onChange={(newValue) => {
              dispatch({
                type: 'set-form-filter',
                payload: { ...filterFormFields, from: newValue },
              });
            }}
          />
          <DatePicker
            value={filterFormFields.to}
            label="Đến ngày"
            onChange={(newValue) => {
              dispatch({
                type: 'set-form-filter',
                payload: { ...filterFormFields, to: newValue },
              });
            }}
          />
        </Stack> */}
        <Stack direction="column" mb={3}>
          <Autocomplete
            fullWidth
            options={
              dataMaTram
                ? dataMaTram.elements
                    .filter((t) => t.maTram)
                    .map((maTram) => ({
                      id: maTram.id.toString(),
                      ten: maTram.maTram,
                    }))
                : []
            }
            value={filterFormFields.maTram}
            getOptionLabel={(option: OptionTypeTram | string) => (option as OptionTypeTram).ten}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={(e, newValue) => {
              dispatch({
                type: 'set-form-filter',
                payload: { ...filterFormFields, maTram: newValue },
              });
            }}
            renderInput={(params) => <TextField {...params} label="Mã Trạm" />}
            renderOption={(props, option) => (
              <li {...props} key={option.id}>
                {option.ten}
              </li>
            )}
          />
        </Stack>
        {/* <Stack direction="column" mb={3}>
          <TextField
            fullWidth
            name="soHopDong"
            value={filterFormFields.soHopDong}
            onChange={(event) =>
              dispatch({
                type: 'set-form-filter',
                payload: { ...filterFormFields, soHopDong: event.target.value },
              })
            }
            placeholder="Số hợp đồng"
          />
        </Stack>
        <Stack direction="column" mb={3}>
          <TextField
            fullWidth
            name="soHopDongErp"
            value={filterFormFields.soHopDongErp}
            onChange={(event) =>
              dispatch({
                type: 'set-form-filter',
                payload: { ...filterFormFields, soHopDongErp: event.target.value },
              })
            }
            placeholder="Số hợp đồng ERP"
          />
        </Stack> */}
        <Stack direction="column" mb={3} spacing={3}>
          <DatePicker
            value={filterFormFields.ngayKyFrom}
            label="Ngày ký từ ngày"
            onChange={(newValue) => {
              dispatch({
                type: 'set-form-filter',
                payload: { ...filterFormFields, ngayKyFrom: newValue },
              });
            }}
          />
          <DatePicker
            value={filterFormFields.ngayKyTo}
            label="Ngày ký đến ngày"
            onChange={(newValue) => {
              dispatch({
                type: 'set-form-filter',
                payload: { ...filterFormFields, ngayKyTo: newValue },
              });
            }}
          />
        </Stack>
        <Stack direction="column" mb={3} spacing={3}>
          <DatePicker
            value={filterFormFields.ngayKetThucFrom}
            label="Ngày kết thúc từ ngày"
            onChange={(newValue) => {
              dispatch({
                type: 'set-form-filter',
                payload: { ...filterFormFields, ngayKetThucFrom: newValue },
              });
            }}
          />
          <DatePicker
            value={filterFormFields.ngayKetThucTo}
            label="Ngày kết thúc đến ngày"
            onChange={(newValue) => {
              dispatch({
                type: 'set-form-filter',
                payload: { ...filterFormFields, ngayKetThucTo: newValue },
              });
            }}
          />
        </Stack>
        <Stack direction="column" mb={3}>
          <Autocomplete
            fullWidth
            options={
              dataHinhThucDauTu
                ? dataHinhThucDauTu.elements.map((htdt) => ({
                    id: htdt.id.toString(),
                    ten: htdt.ten,
                  }))
                : []
            }
            value={filterFormFields.hinhThucDauTuId}
            getOptionLabel={(option: OptionTypeTram | string) => (option as OptionTypeTram).ten}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={(e, newValue) => {
              dispatch({
                type: 'set-form-filter',
                payload: { ...filterFormFields, hinhThucDauTuId: newValue },
              });
            }}
            renderInput={(params) => <TextField {...params} label="Hình thức đầu tư" />}
            renderOption={(props, option) => (
              <li {...props} key={option.id}>
                {option.ten}
              </li>
            )}
          />
        </Stack>
        <Stack direction="column" mb={3}>
          <Autocomplete
            fullWidth
            options={
              dataHinhThucKyHopDong
                ? dataHinhThucKyHopDong.elements.map((item) => ({
                    id: item.id.toString(),
                    ten: item.ten,
                  }))
                : []
            }
            value={filterFormFields.hinhThucKyHopDongId}
            getOptionLabel={(option: OptionTypeTram | string) => (option as OptionTypeTram).ten}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={(e, newValue) => {
              dispatch({
                type: 'set-form-filter',
                payload: { ...filterFormFields, hinhThucKyHopDongId: newValue },
              });
            }}
            renderInput={(params) => <TextField {...params} label="Hình thức ký hợp đồng" />}
            renderOption={(props, option) => (
              <li {...props} key={option.id}>
                {option.ten}
              </li>
            )}
          />
        </Stack>
        <Stack direction="column" mb={3}>
          <Autocomplete
            fullWidth
            options={
              dataDoiTuongKyHopDong
                ? dataDoiTuongKyHopDong.elements.map((item) => ({
                    id: item.id.toString(),
                    ten: item.ten,
                  }))
                : []
            }
            value={filterFormFields.doiTuongKyHopDongId}
            getOptionLabel={(option: OptionTypeTram | string) => (option as OptionTypeTram).ten}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={(e, newValue) => {
              dispatch({
                type: 'set-form-filter',
                payload: { ...filterFormFields, doiTuongKyHopDongId: newValue },
              });
            }}
            renderInput={(params) => <TextField {...params} label="Đối tượng ký hợp đồng" />}
            renderOption={(props, option) => (
              <li {...props} key={option.id}>
                {option.ten}
              </li>
            )}
          />
        </Stack>
        {/* <Stack direction="column" mb={3}>
          <TinhTrangThanhToanField
            value={filterFormFields.tinhTrangThanhToan}
            onChange={(event) => {
              dispatch({
                type: 'set-form-filter',
                payload: { ...filterFormFields, tinhTrangThanhToan: event.target.value },
              });
            }}
          />
        </Stack> */}
        <Stack direction="column" mb={3}>
          <Autocomplete
            fullWidth
            options={
              listDataTinh
                ? listDataTinh.elements.map((tinh) => ({
                    id: tinh.id.toString(),
                    ten: tinh.ten,
                  }))
                : []
            }
            value={filterFormFields.idTinh}
            getOptionLabel={(option: OptionTypeTram | string) => (option as OptionTypeTram).ten}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={(e, newValue) => {
              setIdTinhSelected(Number(newValue?.id));
              dispatch({
                type: 'set-form-filter',
                payload: { ...filterFormFields, idTinh: newValue, idHuyen: null, idXa: null },
              });
              setHuyenOptions([]);
              setXaOptions([]);
            }}
            renderInput={(params) => <TextField {...params} label="Tỉnh/TP" />}
          />
        </Stack>
        <Stack direction="column" mb={3}>
          <Autocomplete
            fullWidth
            options={huyenOptions || []}
            value={filterFormFields.idHuyen}
            getOptionLabel={(option: OptionTypeTram | string) => (option as OptionTypeTram).ten}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={(e, newValue) => {
              setXaOptions([]);
              dispatch({
                type: 'set-form-filter',
                payload: { ...filterFormFields, idHuyen: newValue, idXa: null },
              });

              setIdHuyenSelected(Number(newValue?.id));
            }}
            renderInput={(params) => <TextField {...params} label="Quận/Huyện" />}
          />
        </Stack>
        <Stack direction="column" mb={3}>
          <Autocomplete
            fullWidth
            options={xaOptions || []}
            value={filterFormFields.idXa}
            getOptionLabel={(option: OptionTypeTram | string) => (option as OptionTypeTram).ten}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={(e, newValue) => {
              dispatch({
                type: 'set-form-filter',
                payload: { ...filterFormFields, idXa: newValue },
              });
            }}
            renderInput={(params) => <TextField {...params} label="Phường/Xã" />}
          />
        </Stack>
      </Scrollbar>
    </Drawer>
  );
}
