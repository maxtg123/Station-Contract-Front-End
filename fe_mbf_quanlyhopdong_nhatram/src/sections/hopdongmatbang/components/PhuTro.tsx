import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import { IHopDongForm } from 'src/@types/hopdongmatbang';
import { RHFSelect, RHFTextField } from 'src/components/hook-form';
import Iconify from 'src/components/iconify/Iconify';
import NumericFormatVND from 'src/components/input/NumericFormatVND';
import { useDmLoaiHDPhuTrosQuery } from 'src/data/dmLoaiHDPhuTro';

type Props = {
  indexHangMuc: number;
};
const PhuTro = ({ indexHangMuc }: Props) => {
  const { data: dmPhuTroList } = useDmLoaiHDPhuTrosQuery({ refetchOnWindowFocus: false });
  const { control, trigger } = useFormContext<IHopDongForm>();
  const {
    fields: phuTroList,
    append,
    remove,
    update,
  } = useFieldArray({
    control,
    name: `hangMucs.${indexHangMuc}.phuTroList`,
  });

  const handleThemPhuTro = () => {
    append({ gia: '', hienThiThongTinChiTiet: true, dmPhuTroId: '' });
  };

  const handleXoaPhuTro = (index: number) => {
    remove(index);
  };

  const handleChangePhuTro = ({
    index,
    dmId,
    gia,
  }: {
    index: number;
    dmId: number;
    gia: number;
  }) => {
    const currentPhuTro = phuTroList[index];
    update(index, {
      ...currentPhuTro,
      gia,
      dmPhuTroId: dmId,
    });
    // trigger(`phuTroList.${index}.dmPhuTroId`);
    // trigger(`phuTroList.${index}.gia`);
  };

  const handleCheckBox = ({ index, checked }: { index: number; checked: boolean }) => {
    const currentPhuTro = phuTroList[index];
    update(index, {
      ...currentPhuTro,
      hienThiThongTinChiTiet: checked,
    });
  };

  return (
    <Stack spacing={2} my={2}>
      {/* Title */}
      {phuTroList.length > 0 && (
        <Typography variant="overline" component="p" gutterBottom sx={{ textTransform: 'none' }}>
          Thuê phụ trợ
        </Typography>
      )}
      {/* Selected List  */}
      {phuTroList.map((phutro, index) => {
        return (
          <Box sx={{ width: '100%' }} key={phutro.id}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Box sx={{ width: '100%' }}>
                <RHFSelect
                  value={`${phutro.dmPhuTroId}`}
                  name={`hangMucs.${indexHangMuc}.phuTroList.${index}.dmPhuTroId`}
                  label="Tên"
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    const targetPhuTro = dmPhuTroList?.elements.find(
                      (pt) => pt.id === parseInt(event.target.value, 10)
                    );
                    if (targetPhuTro) {
                      handleChangePhuTro({ index, dmId: targetPhuTro.id, gia: targetPhuTro.gia });
                    }
                  }}
                >
                  {dmPhuTroList
                    ? dmPhuTroList?.elements.map((row, key) => (
                        <MenuItem key={key} value={`${row.id}`}>
                          {row.ten}
                        </MenuItem>
                      ))
                    : []}
                </RHFSelect>
              </Box>
              <Box sx={{ width: '50%' }}>
                <RHFTextField
                  name={`hangMucs.${indexHangMuc}.phuTroList.${index}.gia`}
                  label="Giá"
                  InputProps={{
                    inputComponent: NumericFormatVND as any,
                    endAdornment: <InputAdornment position="end">VNĐ</InputAdornment>,
                  }}
                />
              </Box>

              <Button
                onClick={() => handleXoaPhuTro(index)}
                color="error"
                size="small"
                startIcon={<Iconify icon="eva:trash-2-outline" />}
              >
                Xoá
              </Button>
            </Stack>
            <Box>
              <Controller
                name={`hangMucs.${indexHangMuc}.phuTroList.${index}.hienThiThongTinChiTiet`}
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <div>
                    <FormControlLabel
                      control={
                        <Checkbox
                          {...field}
                          checked={phutro.hienThiThongTinChiTiet}
                          onChange={() => {
                            handleCheckBox({ index, checked: !phutro.hienThiThongTinChiTiet });
                          }}
                        />
                      }
                      label="Hiển thị giá vào chi tiết hợp đồng"
                    />
                  </div>
                )}
              />
            </Box>
          </Box>
        );
      })}

      {/* Add new  */}
      {dmPhuTroList && phuTroList.length < dmPhuTroList?.elements.length && (
        <Button onClick={handleThemPhuTro} sx={{ width: 160, justifyContent: 'flex-start' }}>
          <Iconify icon="eva:plus-fill" />
          <span style={{ marginLeft: 10, textTransform: 'none' }}>Thêm phụ trợ</span>
        </Button>
      )}
    </Stack>
  );
};

export default PhuTro;
