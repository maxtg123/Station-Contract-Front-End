import { Stack } from '@mui/material';

import { memo } from 'react';
import ChuTaiKhoanField from '../fields/ChuTaiKhoanField';
import CmndDoiTacField from '../fields/CmndDoiTacField';
import DiaChiLienHeField from '../fields/DiaChiLienHeField';
import HinhThucThanhToanField from '../fields/HinhThucThanhToanField';
import MaSoThueField from '../fields/MaSoThueField';
import NganHangField from '../fields/NganHangField';
import SdtDoiTacField from '../fields/SdtDoiTacField';
import SoTaiKhoanField from '../fields/SoTaiKhoanField';
import TenDoiTacField from '../fields/TenDoiTacField';

const TabDoiTac = () => (
  <div>
    <Stack direction="row" spacing={2} mb={2}>
      <TenDoiTacField />
      <SdtDoiTacField />
    </Stack>

    <Stack direction="row" spacing={2} mb={2}>
      <CmndDoiTacField />

      <MaSoThueField />
    </Stack>

    <Stack direction="row" spacing={2} mb={2}>
      <DiaChiLienHeField />
    </Stack>

    <Stack direction="row" spacing={2} mb={2}>
      <ChuTaiKhoanField />
      <SoTaiKhoanField />
    </Stack>
    <Stack direction="row" spacing={2} mb={2} alignItems="flex-start">
      <NganHangField />
    </Stack>
    <Stack direction="row" spacing={2} mb={2} alignItems="center">
      <HinhThucThanhToanField />
    </Stack>
  </div>
);

export default memo(TabDoiTac);
