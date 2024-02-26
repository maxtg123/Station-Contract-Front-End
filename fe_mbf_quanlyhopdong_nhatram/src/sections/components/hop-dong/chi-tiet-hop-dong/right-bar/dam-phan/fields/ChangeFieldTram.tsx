import {
  Autocomplete,
  Button,
  Card,
  FormControl,
  FormHelperText,
  InputAdornment,
  Stack,
  TextField,
} from '@mui/material';
import { useState } from 'react';
import { Controller, UseFieldArrayRemove, useFormContext } from 'react-hook-form';
import { IDamPhamForm } from 'src/@types/damphan';
import { RHFTextField } from 'src/components/hook-form';
import Iconify from 'src/components/iconify/Iconify';
import NumericFormatVND from 'src/components/input/NumericFormatVND';

type OptionType = {
  id: string;
  label: string;
};

const OPTS = [
  { id: 'gia_cn_de_xuat', label: 'Giá chủ nhà đề xuất' },
  { id: 'gia_quy_dinh', label: 'Giá quy định' },
  { id: 'noi_dung_khac', label: 'Nội dung khác' },
];

type Props = {
  tramIndex: number;
  filedIndex: number;
  remove: UseFieldArrayRemove;
};
const ChangeFieldTram = ({ tramIndex, filedIndex, remove }: Props) => {
  const { control, setValue } = useFormContext<IDamPhamForm>();
  const [selectedOpt, setSelectedOption] = useState<OptionType | null>(null);

  const handleDelete = () => {
    remove(filedIndex);
  };
  return (
    <Card sx={{ p: 2 }}>
      <Stack direction="column">
        <Stack direction="row" spacing={2} alignItems="center">
          <Autocomplete
            fullWidth
            size="small"
            options={OPTS}
            // value={filterFormFields.hinhThucDauTuId}
            getOptionLabel={(option: OptionType) => (option as OptionType).label}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={(e, newValue) => {
              if (newValue?.id === 'gia_cn_de_xuat' || newValue?.id === 'gia_quy_dinh') {
                setValue(`hopDongTrams.${tramIndex}.changesTram.${filedIndex}.key`, newValue.id);
              }
              setSelectedOption(newValue);
            }}
            renderInput={(params) => <TextField {...params} label="Trường thay đổi" />}
            renderOption={(props, option) => (
              <li {...props} key={option.id}>
                {option.label}
              </li>
            )}
          />
          <Button
            onClick={() => handleDelete()}
            color="error"
            size="small"
            startIcon={<Iconify icon="eva:trash-2-outline" />}
          >
            Xoá
          </Button>
        </Stack>
        {selectedOpt && (
          <Stack direction="column" spacing={2} mt={2}>
            {selectedOpt.id !== 'gia_cn_de_xuat' && selectedOpt.id !== 'gia_quy_dinh' && (
              <RHFTextField
                size="small"
                name={`hopDongTrams.${tramIndex}.changesTram.${filedIndex}.key`}
                label="Tên (*)"
              />
            )}

            {['gia_cn_de_xuat', 'gia_quy_dinh'].includes(selectedOpt.id) ? (
              <Controller
                name={`hopDongTrams.${tramIndex}.changesTram.${filedIndex}.value`}
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormControl sx={{ width: '100%' }}>
                    <TextField
                      {...field}
                      size="small"
                      fullWidth
                      value={typeof field.value === 'number' && field.value === 0 ? 0 : field.value}
                      error={!!error}
                      InputProps={{
                        inputComponent: NumericFormatVND as any,
                        endAdornment: <InputAdornment position="end">VNĐ</InputAdornment>,
                      }}
                    />
                    {!!error && (
                      <FormHelperText error={!!error}>{error ? error?.message : ''}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            ) : (
              <RHFTextField
                size="small"
                name={`hopDongTrams.${tramIndex}.changesTram.${filedIndex}.value`}
                label="Nội dung (*)"
              />
            )}
            <RHFTextField
              size="small"
              name={`hopDongTrams.${tramIndex}.changesTram.${filedIndex}.ghiChu`}
              label="Ghi chú"
            />
          </Stack>
        )}
      </Stack>
    </Card>
  );
};

export default ChangeFieldTram;
