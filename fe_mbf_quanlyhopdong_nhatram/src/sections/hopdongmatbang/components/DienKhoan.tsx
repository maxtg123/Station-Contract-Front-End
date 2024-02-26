import { Box, Button, IconButton, InputAdornment, Stack, Tooltip, Typography } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { IHopDongHangMucTramForm } from 'src/@types/hopdong';
import { IHopDongForm } from 'src/@types/hopdongmatbang';
import RHFTextFieldHasZero from 'src/components/hook-form/RHFTextFieldHasZero';
import Iconify from 'src/components/iconify/Iconify';
import NumericFormatVND from 'src/components/input/NumericFormatVND';

type Props = {
  indexHangMuc: number;
  fieldHangMuc: IHopDongHangMucTramForm;
};
const DienKhoan = ({ indexHangMuc, fieldHangMuc }: Props) => {
  const { setValue } = useFormContext<IHopDongForm>();

  const wDienKhoan = fieldHangMuc.dienKhoan;

  const handleAddedDienKhoan = () => {
    // performance than update
    setValue(`hangMucs.${indexHangMuc}.dienKhoan`, { added: true, gia: 0 });
  };

  const handleXoaDienKhoan = () => {
    setValue(`hangMucs.${indexHangMuc}.dienKhoan`, { added: false, gia: 0 });
  };

  return (
    <Stack spacing={2} my={2}>
      {wDienKhoan.added ? (
        <Box sx={{ width: '50%' }}>
          <Typography variant="overline" component="p" gutterBottom sx={{ textTransform: 'none' }}>
            Giá điện khoán <span style={{ color: '#FF0000' }}>(*)</span>
            <Tooltip
              title={
                <Box sx={{ whiteSpace: 'pre-line' }}>
                  {`- Giá điện khoán đã được tính toán và nằm trong Giá thuê.
                  - Khai báo giá điện khoán giúp xuất file thanh toán có thể thể hiện thành 2 dòng.`}
                </Box>
              }
              placement="right-end"
            >
              <IconButton color="default">
                <Iconify icon="eva:alert-circle-fill" />
              </IconButton>
            </Tooltip>
          </Typography>
          <Stack direction="row" alignItems="center" spacing={2}>
            <RHFTextFieldHasZero
              name={`hangMucs.${indexHangMuc}.dienKhoan.gia`}
              hiddenLabel
              InputProps={{
                inputComponent: NumericFormatVND as any,
                endAdornment: <InputAdornment position="start">VNĐ</InputAdornment>,
              }}
            />
            <Button
              onClick={handleXoaDienKhoan}
              color="error"
              size="small"
              startIcon={<Iconify icon="eva:trash-2-outline" />}
            >
              Xoá
            </Button>
          </Stack>
        </Box>
      ) : (
        <Button onClick={handleAddedDienKhoan} sx={{ width: 160, justifyContent: 'flex-start' }}>
          <Iconify icon="eva:plus-fill" />
          <span style={{ marginLeft: 10, textTransform: 'none' }}>Thêm điện khoán</span>
        </Button>
      )}
    </Stack>
  );
};

export default DienKhoan;
