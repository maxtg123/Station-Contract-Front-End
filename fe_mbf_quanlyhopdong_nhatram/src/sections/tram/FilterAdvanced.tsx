import {
  Autocomplete,
  Box,
  Divider,
  Drawer,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import equal from 'fast-deep-equal';
import isNil from 'lodash/isNil';
import { useEffect, useState } from 'react';
import { OptionTypeTram } from 'src/@types/common';
import Iconify from 'src/components/iconify/Iconify';
import Scrollbar from 'src/components/scrollbar/Scrollbar';
import { useTramFilterContext } from 'src/context/tram/tramFilterContext';
import { useDmHuyensQuery } from 'src/data/dmHuyen';
import { useDmLoaiCshtsQuery } from 'src/data/dmLoaiCsht';
import { useDmPhongDaisQuery } from 'src/data/dmPhongDai';
import { useDmTinhsQuery } from 'src/data/dmTinh';
import { useDmTosQuery } from 'src/data/dmTo';
import { useDmXasQuery } from 'src/data/dmXa';
import { getAuthCredentials } from 'src/utils/authUtils';

type Props = {
  open: boolean;
  onClose: VoidFunction;
  title: string;
};
const WIDTH_DRAWER = 360;
const SPACING = 2.5;
const DEFAULT_TINH = 1;
const DEFAULT_HUYEN = 1;
const RAD_STATUS = [
  { value: '', label: 'Tất cả' },
  { value: 'NGUNG_HOAT_DONG', label: 'Tạm dừng' },
  { value: 'HOAT_DONG', label: 'Hoạt động' },
] as const;

export default function FilterAdvanced({ open, onClose, title }: Props) {
  const theme = useTheme();
  const {
    state: { filterFormFields },
    dispatch,
  } = useTramFilterContext();
  const [idTinhSelected, setIdTinhSelected] = useState(DEFAULT_TINH);
  const [idHuyenSelected, setIdHuyenSelected] = useState(DEFAULT_HUYEN);
  const [idPhongDaiSelected, setIdPhongDaiSelected] = useState(0);

  const [dataTo, setDataTo] = useState<OptionTypeTram[]>([]);
  const [pdOptions, setPdOptions] = useState<OptionTypeTram[]>([]);
  const [huyenOptions, setHuyenOptions] = useState<OptionTypeTram[]>([]);

  const [xaOptions, setXaOptions] = useState<OptionTypeTram[]>([]);

  const { data: listDataTinh } = useDmTinhsQuery({ refetchOnWindowFocus: false });
  const { data: listDataHuyen } = useDmHuyensQuery(Number(idTinhSelected) || DEFAULT_TINH, {
    refetchOnWindowFocus: false,
  });
  const { data: listDataXa } = useDmXasQuery(Number(idHuyenSelected) || DEFAULT_HUYEN, {
    refetchOnWindowFocus: false,
  });
  const { data: listDataPhongDai } = useDmPhongDaisQuery({ refetchOnWindowFocus: false });
  const { data: listDataTo } = useDmTosQuery({ refetchOnWindowFocus: false });
  const { data: listDataLoaiCsht } = useDmLoaiCshtsQuery({ refetchOnWindowFocus: false });

  useEffect(() => {
    let newToOptions: OptionTypeTram[] = [];
    if (
      !isNil(listDataTo) &&
      !equal(listDataTo, dataTo) &&
      idPhongDaiSelected &&
      idPhongDaiSelected !== 0
    ) {
      const filterTo = listDataTo.elements.filter(
        (item) => item.phongDai.id === idPhongDaiSelected
      );
      newToOptions = filterTo.map((to) => ({
        id: to.id.toString(),
        ten: to.ten,
      }));
      setDataTo(newToOptions);
    }
  }, [dataTo, idPhongDaiSelected, listDataTo]);

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

  const handleResetFilter = () => {
    setHuyenOptions([]);
    setXaOptions([]);
    setDataTo([]);
    dispatch({ type: 'reset-form-filter' });
  };

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
        <Typography variant="subtitle1" sx={{ flexGrow: 1, color: theme.palette.primary.main }}>
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
        <Stack direction="row" mb={2}>
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
            value={filterFormFields.tinh}
            getOptionLabel={(option: OptionTypeTram | string) => (option as OptionTypeTram).ten}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={(e, newValue) => {
              setIdTinhSelected(Number(newValue?.id));

              dispatch({
                type: 'set-form-filter',
                payload: { ...filterFormFields, tinh: newValue, huyen: null, xa: null },
              });
              setHuyenOptions([]);
              setXaOptions([]);
            }}
            renderInput={(params) => <TextField {...params} label="Tỉnh/TP" />}
          />
        </Stack>
        <Stack direction="row" mb={2}>
          <Autocomplete
            fullWidth
            options={huyenOptions || []}
            value={filterFormFields.huyen}
            getOptionLabel={(option: OptionTypeTram | string) => (option as OptionTypeTram).ten}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={(e, newValue) => {
              setXaOptions([]);
              dispatch({
                type: 'set-form-filter',
                payload: { ...filterFormFields, huyen: newValue, xa: null },
              });

              setIdHuyenSelected(Number(newValue?.id));
            }}
            renderInput={(params) => <TextField {...params} label="Quận/Huyện" />}
          />
        </Stack>
        <Stack direction="row" mb={2}>
          <Autocomplete
            fullWidth
            options={xaOptions || []}
            value={filterFormFields.xa}
            getOptionLabel={(option: OptionTypeTram | string) => (option as OptionTypeTram).ten}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={(e, newValue) => {
              dispatch({ type: 'set-form-filter', payload: { ...filterFormFields, xa: newValue } });
            }}
            renderInput={(params) => <TextField {...params} label="Phường/Xã" />}
          />
        </Stack>
        <Stack direction="row" mb={2}>
          <Autocomplete
            fullWidth
            options={pdOptions || []}
            value={filterFormFields.phongDai}
            getOptionLabel={(option: OptionTypeTram | string) => (option as OptionTypeTram).ten}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={(e, newValue) => {
              setIdPhongDaiSelected(Number(newValue?.id));
              dispatch({
                type: 'set-form-filter',
                payload: { ...filterFormFields, phongDai: newValue, to: null },
              });

              setDataTo([]);
            }}
            renderInput={(params) => <TextField {...params} label="Phòng/Đài" />}
          />
        </Stack>
        <Stack direction="row" mb={3}>
          <Autocomplete
            fullWidth
            options={dataTo || []}
            value={filterFormFields.to}
            getOptionLabel={(option: OptionTypeTram | string) => (option as OptionTypeTram).ten}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={(e, newValue) => {
              dispatch({ type: 'set-form-filter', payload: { ...filterFormFields, to: newValue } });
            }}
            renderInput={(params) => <TextField {...params} label="Tổ" />}
          />
        </Stack>
        <Stack direction="column" mb={3}>
          <Typography variant="subtitle1" gutterBottom sx={{ textTransform: 'none' }}>
            Trạng thái hoạt động
          </Typography>
          <RadioGroup
            value={filterFormFields.trangThaiHoatDong}
            onChange={(event) =>
              dispatch({
                type: 'set-form-filter',
                payload: { ...filterFormFields, trangThaiHoatDong: event.target.value },
              })
            }
          >
            {RAD_STATUS.map((item, index) => (
              <FormControlLabel
                key={index}
                value={item.value}
                control={<Radio />}
                label={item.label}
              />
            ))}
          </RadioGroup>
        </Stack>
        {/* <Stack direction="column" mb={3}>
          <Typography variant="subtitle1" gutterBottom sx={{ textTransform: 'none' }}>
            Khoảng thời gian của ngày phát sóng
          </Typography>
          <Stack direction="column" spacing={2}>
            <DatePicker
              value={filterFormFields.fromDate}
              label="Từ ngày"
              onChange={(newValue) => {
                dispatch({
                  type: 'set-form-filter',
                  payload: { ...filterFormFields, fromDate: newValue },
                });
              }}
            />
            <DatePicker
              value={filterFormFields.toDate}
              label="Đến ngày"
              onChange={(newValue) => {
                dispatch({
                  type: 'set-form-filter',
                  payload: { ...filterFormFields, toDate: newValue },
                });
              }}
            />
          </Stack>
        </Stack> */}
        <Stack direction="column" mb={3}>
          <Typography variant="subtitle1" gutterBottom sx={{ textTransform: 'none' }}>
            Loại cơ sở hạ tầng
          </Typography>
          <Autocomplete
            fullWidth
            options={
              listDataLoaiCsht
                ? listDataLoaiCsht.elements.map((tinh) => ({
                    id: tinh.id.toString(),
                    ten: tinh.ten,
                  }))
                : []
            }
            value={filterFormFields.loaiCsht}
            getOptionLabel={(option: OptionTypeTram | string) => (option as OptionTypeTram).ten}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={(e, newValue) => {
              dispatch({
                type: 'set-form-filter',
                payload: { ...filterFormFields, loaiCsht: newValue },
              });
            }}
            renderInput={(params) => <TextField {...params} label="Loại CSHT" />}
            renderOption={(props, option) => (
              <li {...props} key={option.id}>
                {option.ten}
              </li>
            )}
          />
        </Stack>
      </Scrollbar>
    </Drawer>
  );
}
