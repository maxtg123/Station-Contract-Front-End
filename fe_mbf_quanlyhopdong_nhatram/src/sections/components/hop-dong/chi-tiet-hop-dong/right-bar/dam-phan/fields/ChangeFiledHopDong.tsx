import { Autocomplete, Button, Card, Stack, TextField } from '@mui/material';
import { useState } from 'react';
import { UseFieldArrayRemove, useFormContext } from 'react-hook-form';
import { IDamPhamForm } from 'src/@types/damphan';
import { RHFTextField } from 'src/components/hook-form';
import Iconify from 'src/components/iconify/Iconify';

export type OptionType = {
  id: string;
  label: string;
};
type Props = {
  filedIndex: number;
  remove: UseFieldArrayRemove;
};
const OPTS = [
  { id: 'thoi_gian_gia_han', label: 'Thời gian gia hạn' },
  { id: 'noi_dung_khac', label: 'Nội dung khác' },
];

const ChangeFiledHopDong = ({ filedIndex, remove }: Props) => {
  const { setValue } = useFormContext<IDamPhamForm>();
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
            getOptionLabel={(option: OptionType) => (option as OptionType).label}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={(e, newValue) => {
              if (newValue?.id === 'thoi_gian_gia_han') {
                setValue(`changesHopDong.${filedIndex}.key`, 'thoi_gian_gia_han');
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
            {selectedOpt.id !== 'thoi_gian_gia_han' && (
              <RHFTextField
                size="small"
                name={`changesHopDong.${filedIndex}.key`}
                label="Tên (*)"
                placeholder="Ví dụ: Thời gian gia hạn"
              />
            )}

            <RHFTextField
              size="small"
              name={`changesHopDong.${filedIndex}.value`}
              label="Nội dung (*)"
              placeholder="Ví dụ: 5 năm"
            />
            <RHFTextField
              size="small"
              name={`changesHopDong.${filedIndex}.ghiChu`}
              label="Ghi chú"
            />
          </Stack>
        )}
      </Stack>
    </Card>
  );
};

export default ChangeFiledHopDong;
