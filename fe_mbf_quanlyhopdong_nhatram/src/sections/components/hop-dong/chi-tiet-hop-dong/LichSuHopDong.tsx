import { Box } from '@mui/material';
import React from 'react';
import LichSuHopDongFilter from './lich-su-hop-dong/LichSuHopDongFilter';
import LichSuHopDongTimeLine from './lich-su-hop-dong/LichSuHopDongTimeLine';

type Props = {
  data: any;
};

export default function LichSuHopDong({ data }: Props) {
  return (
    <Box>
      <LichSuHopDongFilter />
      <LichSuHopDongTimeLine />
    </Box>
  );
}
