import { Box, Divider, Stack } from '@mui/material';
import { memo } from 'react';
import { IHopDongHangMucTramForm } from 'src/@types/hopdong';
import FilesSection from '../components/FilesSection';
import DonViDungChungField from '../fields/DonViDungChungField';
import LoaiHangMucCshtField from '../fields/LoaiHangMucCshtField';
import MaDonViDungChungField from '../fields/MaDonViDungChungField';
import NgayLapDatThietBiField from '../fields/NgayLapDatThietBiField';
import ThoiDiemPhatSinhField from '../fields/ThoiDiemPhatSinhField';
import NgayDungChung from '../fields/NgayDungChung';

type Props = {
  indexHangMuc: number;
  filedHangMuc: IHopDongHangMucTramForm;
};
const TabDungChung = ({ indexHangMuc, filedHangMuc }: Props) => {
  return (
    <div>
      <Stack direction="row" spacing={2} mb={4}>
        <LoaiHangMucCshtField indexHangMuc={indexHangMuc} filedHangMuc={filedHangMuc} />
        <MaDonViDungChungField indexHangMuc={indexHangMuc} filedHangMuc={filedHangMuc} />
      </Stack>

      <Stack direction="row" spacing={2} mb={4}>
        <NgayLapDatThietBiField indexHangMuc={indexHangMuc} />
        <ThoiDiemPhatSinhField indexHangMuc={indexHangMuc} />
      </Stack>

      <NgayDungChung indexHangMuc={indexHangMuc} />

      <Stack direction="row" spacing={2} mb={4}>
        <Box width="50%">
          <DonViDungChungField indexHangMuc={indexHangMuc} />
        </Box>
      </Stack>

      <Divider sx={{ borderStyle: 'dashed', mb: 4 }} />

      <FilesSection filesName="filesDinhKem" indexHangMuc={indexHangMuc} />
    </div>
  );
};

export default memo(TabDungChung);
