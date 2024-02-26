import { Button, Stack, Typography } from '@mui/material';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { IDamPhamForm } from 'src/@types/damphan';
import Iconify from 'src/components/iconify/Iconify';
import { useChiTietHopDongContext } from 'src/context/hop-dong/chitietHopDongContext';
import ChangeFieldTram from './ChangeFieldTram';

type Props = {
  index: number;
};

const ChangeFieldsTram = ({ index }: Props) => {
  const {
    state: { hopDong },
  } = useChiTietHopDongContext();

  const { control } = useFormContext<IDamPhamForm>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: `hopDongTrams.${index}.changesTram`,
  });

  const hdTram = hopDong?.hopDongTramList?.[index];
  if (!hdTram) {
    return null;
  }

  const handleAdd = () => {
    append({ key: '', value: '', ghiChu: '' });
  };

  return (
    <Stack direction="column">
      <Stack direction="column" sx={{ mb: 2 }}>
        <Typography variant="overline" color="text.disabled">
          Nội dung chung của trạm
        </Typography>
        <Typography variant="caption" color="text.disabled">
          Mã trạm: {hdTram.tram.maTram}
        </Typography>
        <Typography variant="caption" color="text.disabled">
          Mã ĐTXD: {hdTram.tram.maDauTuXayDung}
        </Typography>
      </Stack>
      <Stack spacing={2}>
        {fields.map((field, i) => {
          return (
            <div key={field.id}>
              <ChangeFieldTram tramIndex={index} filedIndex={i} remove={remove} />
            </div>
          );
        })}
        <Button
          fullWidth
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={handleAdd}
          sx={{ fontSize: 14 }}
        >
          Thêm nội dung
        </Button>
      </Stack>
    </Stack>
  );
};

export default ChangeFieldsTram;
