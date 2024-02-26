import { Box, IconButton, InputAdornment, Stack, Tooltip } from '@mui/material';
import { RHFCheckbox } from 'src/components/hook-form';
import RHFTextFieldHasZero from 'src/components/hook-form/RHFTextFieldHasZero';
import Iconify from 'src/components/iconify/Iconify';
import NumericFormatVND from 'src/components/input/NumericFormatVND';
import { IHopDongForm } from 'src/@types/hopdongmatbang';

type Props = {
  isCoKyQuy: boolean;
};

const KyQuyField = ({ isCoKyQuy }: Props) => (
  <Stack direction="row" width="100%" alignItems="center">
    <Box sx={{ width: '20%', display: 'flex' }} justifyContent="flex-start">
      <RHFCheckbox name="coKyQuy" label="Ký quỹ" sx={{ mr: 0 }} />
      <Tooltip
        title={
          <div style={{ whiteSpace: 'pre-line' }}>
            {`Ký quỹ thể hiện rằng hợp đồng đã được đặt tiền cọc trước.\nKhi thanh lý hợp đồng trường ký quỹ cần được bỏ chọn.`}
          </div>
        }
        placement="right"
      >
        <IconButton color="default">
          <Iconify icon="eva:alert-circle-fill" />
        </IconButton>
      </Tooltip>
    </Box>

    {!!isCoKyQuy && (
      <RHFTextFieldHasZero
        name="giaKyQuy"
        sx={{ maxWidth: '29%' }}
        fullWidth
        label="Giá ký quỹ"
        InputProps={{
          inputComponent: NumericFormatVND as any,
          endAdornment: <InputAdornment position="end">VNĐ</InputAdornment>,
        }}
      />
    )}
  </Stack>
);

export default KyQuyField;
