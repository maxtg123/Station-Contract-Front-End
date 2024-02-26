import { ListHopDongProvider } from 'src/context/hop-dong-mat-bang/listHopDongContext';
import HopDongContainer from 'src/sections/hopdongmatbang/HopDongContainer';

import { HopDongFilterProvider } from 'src/context/hop-dong-mat-bang/hopDongFilterContext';
import DashboardLayout from '../../layouts/dashboard';
// ----------------------------------------------------------------------

HopDongMatBangPage.getLayout = (page: React.ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);

// ----------------------------------------------------------------------

export default function HopDongMatBangPage() {
  return (
    <ListHopDongProvider>
      <HopDongFilterProvider>
        <HopDongContainer />
      </HopDongFilterProvider>
    </ListHopDongProvider>
  );
}
