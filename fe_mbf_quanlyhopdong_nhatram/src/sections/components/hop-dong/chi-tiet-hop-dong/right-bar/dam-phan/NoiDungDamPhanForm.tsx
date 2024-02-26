import { Button, Divider, Stack, Typography } from '@mui/material';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { IDamPhamForm } from 'src/@types/damphan';
import Iconify from 'src/components/iconify/Iconify';
import { useChiTietHopDongContext } from 'src/context/hop-dong/chitietHopDongContext';
import ChangeFieldsTram from './fields/ChangeFieldsTram';
import ChangeFiledHopDong from './fields/ChangeFiledHopDong';

const NoiDungDamPhanForm = () => {
  const {
    state: { hopDong },
  } = useChiTietHopDongContext();
  const { control } = useFormContext<IDamPhamForm>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'changesHopDong',
  });
  const handleAddChangeHopDong = () => {
    append({ key: '', value: '' });
  };
  return (
    <Stack spacing={2} sx={{ px: 2, pb: 3 }}>
      <Typography variant="overline" color="text.disabled">
        Nội dung chung của hợp đồng
      </Typography>
      {fields.map((field, i) => {
        return <ChangeFiledHopDong filedIndex={i} key={field.id} remove={remove} />;
      })}
      <Button
        fullWidth
        color="inherit"
        startIcon={<Iconify icon="eva:plus-fill" />}
        onClick={handleAddChangeHopDong}
        sx={{ fontSize: 14 }}
      >
        Thêm nội dung
      </Button>
      <Divider style={{ borderStyle: 'dashed' }} />
      {hopDong?.hopDongTramList.map((hdTram, tramIndex) => {
        return <ChangeFieldsTram key={hdTram.id} index={tramIndex} />;
      })}
    </Stack>
  );
};

export default NoiDungDamPhanForm;
