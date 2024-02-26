import {
  Box,
  Checkbox,
  Divider,
  FormControl,
  FormHelperText,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { addDays } from 'date-fns';
import isEmpty from 'lodash/isEmpty';
import { useEffect } from 'react';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import { IHopDongHangMucTramForm } from 'src/@types/hopdong';
import { IHopDongForm } from 'src/@types/hopdongmatbang';
import Iconify from 'src/components/iconify/Iconify';
import NumericFormatVND from 'src/components/input/NumericFormatVND';
import { useCreateHopDongContext } from 'src/context/hop-dong-mat-bang/createHopDongContext';
import { fCurrencyVND } from 'src/utils/formatNumber';
import { calculatorMoneyBetweenFromTo, generateChuKy } from 'src/utils/hopDongUtils';

type Props = {
  indexHangMuc: number;
  fieldHangMuc: IHopDongHangMucTramForm;
};
const KyThanhToan = ({ indexHangMuc, fieldHangMuc }: Props) => {
  const {
    state: { formType, hopDong },
  } = useCreateHopDongContext();

  const { watch, formState, control, getValues, setValue, trigger } =
    useFormContext<IHopDongForm>();
  const { fields, replace, update } = useFieldArray({
    control,
    name: `hangMucs.${indexHangMuc}.hopDongKyThanhToanList`,
  });

  const { errors, dirtyFields } = formState;
  const wChuKyNam = watch('chuKyNam');
  const wChuKyThang = watch('chuKyThang');
  const wChuKyNgay = watch('chuKyNgay');
  const wNgayBatDauYeuCauThanhToan = fieldHangMuc.ngayBatDauTT;
  const wNgayKetThucHopDong = watch('ngayKetThuc');
  const wGia = fieldHangMuc.giaThueTram;

  // const wKys = watch('hopDongKyThanhToanList');
  const total = fieldHangMuc?.hopDongKyThanhToanList.reduce((accumulator, currentValue) => {
    return accumulator + Number(currentValue.gia);
  }, 0);

  // const haveError =
  //   errors.chuKyNam ||
  //   errors.chuKyThang ||
  //   errors.chuKyNgay ||
  //   errors.ngayBatDauTT ||
  //   errors.ngayKetThuc ||
  //   errors.giaThueTram;
  const haveError = errors.chuKyNam || errors.chuKyThang || errors.chuKyNgay || errors.ngayKetThuc;

  useEffect(() => {
    if (!haveError && formType === 'create') {
      const kys = generateChuKy({
        ngayBatDauYeuCauThanhToan: wNgayBatDauYeuCauThanhToan,
        ngayKetThucHopDong: wNgayKetThucHopDong,
        chuKyNam: typeof wChuKyNam === 'string' ? parseInt(wChuKyNam || 0, 10) : wChuKyNam || 0,
        chuKyThang:
          typeof wChuKyThang === 'string' ? parseInt(wChuKyThang || 0, 10) : wChuKyThang || 0,
        chuKyNgay: typeof wChuKyNgay === 'string' ? parseInt(wChuKyNgay || 0, 10) : wChuKyNgay || 0,
        giaThueHangThang: wGia,
      });
      replace(
        kys.map((ky) => {
          return {
            tuNgay: ky.from,
            denNgay: ky.to,
            gia: ky.gia,
            daThanhToanNgay: null,
            daThanhToan: false,
          };
        })
      );
    }
  }, [
    haveError,
    wGia,
    wNgayBatDauYeuCauThanhToan,
    wNgayKetThucHopDong,
    wChuKyNam,
    wChuKyThang,
    wChuKyNgay,
    replace,
    formType,
  ]);

  useEffect(() => {
    if (
      isEmpty(haveError) &&
      formType === 'update' &&
      (dirtyFields?.ngayKetThuc ||
        dirtyFields?.chuKyNam ||
        dirtyFields?.chuKyThang ||
        dirtyFields?.chuKyNgay ||
        dirtyFields?.hangMucs?.[indexHangMuc]?.giaThueTram) &&
      // ||dirtyFields?.giaThueTram
      !(typeof wChuKyNam === 'string' && wChuKyNam === '') &&
      !(typeof wChuKyThang === 'string' && wChuKyThang === '') &&
      !(typeof wChuKyNgay === 'string' && wChuKyNgay === '')
    ) {
      const kys = getValues(`hangMucs.${indexHangMuc}.hopDongKyThanhToanList`);
      // const kys = fieldHangMuc.hopDongKyThanhToanList;
      const kysThanhToan = kys.filter((k) => k.daThanhToanNgay !== null);
      const kysChuaThanhToan = kys.filter((k) => k.daThanhToanNgay === null);
      let ngayBatDauYeuCauThanhToan = wNgayBatDauYeuCauThanhToan;
      if (kysChuaThanhToan.length > 0) {
        ngayBatDauYeuCauThanhToan = kysChuaThanhToan[0].tuNgay;
      } else if (kys.length > 0) {
        ngayBatDauYeuCauThanhToan = addDays(kys[kys.length - 1].denNgay, 1);
      }
      const kysMoi = generateChuKy({
        ngayBatDauYeuCauThanhToan,
        ngayKetThucHopDong: wNgayKetThucHopDong,
        chuKyNam: typeof wChuKyNam === 'string' ? parseInt(wChuKyNam || 0, 10) : wChuKyNam || 0,
        chuKyThang:
          typeof wChuKyThang === 'string' ? parseInt(wChuKyThang || 0, 10) : wChuKyThang || 0,
        chuKyNgay: typeof wChuKyNgay === 'string' ? parseInt(wChuKyNgay || 0, 10) : wChuKyNgay || 0,
        giaThueHangThang: wGia,
      }).map((ky) => ({
        tuNgay: ky.from,
        denNgay: ky.to,
        gia: ky.gia,
        daThanhToanNgay: null,
        daThanhToan: false,
      }));
      const allKy = kysThanhToan.concat(kysMoi);
      replace(allKy);
      // }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    // fieldHangMuc.hopDongKyThanhToanList,
    haveError,
    wGia,
    wNgayKetThucHopDong,
    wNgayBatDauYeuCauThanhToan,
    wChuKyNam,
    wChuKyThang,
    wChuKyNgay,
    replace,
    getValues,
    formType,
    dirtyFields?.ngayKetThuc,
    dirtyFields?.chuKyNam,
    dirtyFields?.chuKyThang,
    dirtyFields?.chuKyNgay,
    indexHangMuc,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    dirtyFields?.hangMucs?.[indexHangMuc]?.giaThueTram,
    // dirtyFields?.giaThueTram,
  ]);

  const handleChangeTuNgayKyGanDay = ({
    index,
    tuNgay,
    denNgay,
  }: {
    index: number;
    tuNgay: Date;
    denNgay: Date;
  }) => {
    const gia = calculatorMoneyBetweenFromTo({ from: tuNgay, to: denNgay, giaHangThang: wGia });
    update(index, { tuNgay, denNgay, gia, daThanhToanNgay: null, daThanhToan: false });
  };

  const handleChangeDenNgayKyGanNhat = ({
    index,
    tuNgay,
    denNgay,
  }: {
    index: number;
    tuNgay: Date;
    denNgay: Date;
  }) => {
    const kys = getValues(`hangMucs.${indexHangMuc}.hopDongKyThanhToanList`);
    const kysTruoc = kys.filter((k, i) => i < index);
    const kyBiThayDoi = {
      tuNgay,
      denNgay,
      gia: calculatorMoneyBetweenFromTo({
        from: tuNgay,
        to: denNgay,
        giaHangThang: wGia,
      }),
      daThanhToanNgay: null,
      daThanhToan: false,
    };
    const kysSau = generateChuKy({
      ngayBatDauYeuCauThanhToan: addDays(denNgay, 1),
      ngayKetThucHopDong: wNgayKetThucHopDong,
      chuKyNam: typeof wChuKyNam === 'string' ? parseInt(wChuKyNam || 0, 10) : wChuKyNam || 0,
      chuKyThang:
        typeof wChuKyThang === 'string' ? parseInt(wChuKyThang || 0, 10) : wChuKyThang || 0,
      chuKyNgay: typeof wChuKyNgay === 'string' ? parseInt(wChuKyNgay || 0, 10) : wChuKyNgay || 0,
      giaThueHangThang: wGia,
    }).map((ky) => ({
      tuNgay: ky.from,
      denNgay: ky.to,
      gia: ky.gia,
      daThanhToanNgay: null,
      daThanhToan: false,
    }));
    const newKys = kysTruoc.concat([kyBiThayDoi]).concat(kysSau);
    replace(newKys);
  };

  if (
    // !haveError &&
    wNgayBatDauYeuCauThanhToan &&
    wNgayKetThucHopDong &&
    (wChuKyNam > 0 || wChuKyThang > 0 || wChuKyNgay > 0)
  ) {
    return (
      <Box sx={{ width: '100%' }}>
        <Typography
          variant="overline"
          component="p"
          gutterBottom
          sx={{ textTransform: 'none' }}
          mb={4}
        >
          Các kỳ thanh toán cụ thể như sau:
        </Typography>
        {fields.map((ky, index) => {
          const isDisabled = !!(
            (hopDong?.trangThaiHopDong === 'HOAT_DONG' ||
              hopDong?.trangThaiHopDong === 'CHO_PHE_DUYET_PHU_LUC') &&
            ky.daThanhToanNgay
          );
          return (
            <Stack direction="row" spacing={1.2} mb={2} key={ky.id} alignItems="center">
              <Box
                sx={{
                  width: '46px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Typography variant="overline" gutterBottom sx={{ textTransform: 'none', mb: 0 }}>
                  {`Kỳ ${index + 1}`}
                </Typography>
              </Box>
              <Box sx={{ width: '180px' }}>
                <Controller
                  name={`hangMucs.${indexHangMuc}.hopDongKyThanhToanList.${index}.tuNgay`}
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl sx={{ width: '100%' }}>
                      <DatePicker
                        label="Từ ngày"
                        value={field.value}
                        disabled={isDisabled}
                        onChange={(newValue) => {
                          // if (newValue && !isDisabled) {
                          if (newValue && !isDisabled) {
                            handleChangeTuNgayKyGanDay({
                              index,
                              tuNgay: newValue,
                              denNgay: ky.denNgay,
                            });
                          }
                        }}
                        slotProps={{
                          textField: { error: !!error, size: 'small' },
                        }}
                      />
                      {!!error && (
                        <FormHelperText error={!!error}>{error && error?.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Box>
              <Box sx={{ width: '180px' }}>
                <Controller
                  name={`hangMucs.${indexHangMuc}.hopDongKyThanhToanList.${index}.denNgay`}
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl sx={{ width: '100%' }}>
                      <DatePicker
                        label="Đến ngày"
                        value={field.value}
                        disabled={isDisabled}
                        onChange={(newValue) => {
                          if (newValue && !isDisabled) {
                            handleChangeDenNgayKyGanNhat({
                              index,
                              tuNgay: ky.tuNgay,
                              denNgay: newValue,
                            });
                          }
                        }}
                        slotProps={{
                          textField: { error: !!error, size: 'small' },
                        }}
                      />
                      {!!error && (
                        <FormHelperText error={!!error}>{error && error?.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Số tiền"
                  value={typeof ky.gia === 'number' && ky.gia === 0 ? 0 : ky.gia}
                  InputProps={{
                    inputComponent: NumericFormatVND as any,
                    endAdornment: <InputAdornment position="end">VNĐ</InputAdornment>,
                    disabled: isDisabled,
                  }}
                  onChange={(e) => {
                    const _gia = e.target.value;
                    if (typeof Number(_gia) === 'number' && !isDisabled) {
                      setValue(
                        `hangMucs.${indexHangMuc}.hopDongKyThanhToanList.${index}.gia`,
                        Number(_gia)
                      );
                    }
                  }}
                />
              </Box>
              <Box width="70px">
                <Controller
                  name={`hangMucs.${indexHangMuc}.hopDongKyThanhToanList.${index}.daThanhToan`}
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <Stack direction="row" spacing={1.2} alignItems="center">
                      {!(
                        hopDong?.trangThaiHopDong === 'HOAT_DONG' ||
                        hopDong?.trangThaiHopDong === 'CHO_PHE_DUYET_PHU_LUC'
                      ) && (
                        <Checkbox
                          {...field}
                          checked={field.value}
                          onChange={(e) => {
                            const isCheck = e.target.checked;
                            if (isCheck) {
                              // all ky truoc do se duoc check
                              for (let i = 0; i <= index; i += 1) {
                                setValue(
                                  `hangMucs.${indexHangMuc}.hopDongKyThanhToanList.${i}.daThanhToan`,
                                  true
                                );
                              }
                            } else {
                              for (let i = index; i < fields.length; i += 1) {
                                setValue(
                                  `hangMucs.${indexHangMuc}.hopDongKyThanhToanList.${i}.daThanhToan`,
                                  false
                                );
                              }
                            }
                          }}
                        />
                      )}

                      {field.value && (
                        <Tooltip title="Đã thanh toán" arrow>
                          <Iconify
                            icon="eva:checkmark-circle-fill"
                            sx={{
                              color: 'success.main',
                            }}
                          />
                        </Tooltip>
                      )}
                    </Stack>
                  )}
                />
              </Box>
            </Stack>
          );
        })}
        <Divider sx={{ borderStyle: 'dashed' }} />
        <Stack direction="row-reverse" p={2}>
          <Typography variant="subtitle1" sx={{ color: 'black' }}>
            Tổng cộng: {fCurrencyVND(total)} (VNĐ)
          </Typography>
        </Stack>
      </Box>
    );
  }

  return <Box />;
};

export default KyThanhToan;
