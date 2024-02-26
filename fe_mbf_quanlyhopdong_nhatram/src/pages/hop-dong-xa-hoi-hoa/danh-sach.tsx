import { HopDongXaHoiHoaFilterProvider } from 'src/context/hop-dong-xa-hoi-hoa/hopDongXaHoiHoaFilterContext';
import { ListHopDongXaHoiHoaProvider } from 'src/context/hop-dong-xa-hoi-hoa/listHopDongXaHoiHoaContext';
import HopDongXaHoiHoaContainer from 'src/sections/hopdongxahoihoa/HopDongXaHoiHoaContainer';
import DashboardLayout from '../../layouts/dashboard';
// ----------------------------------------------------------------------

HopDongXaHoiHoaPage.getLayout = (page: React.ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);

// ----------------------------------------------------------------------

export default function HopDongXaHoiHoaPage() {
  return (
    <ListHopDongXaHoiHoaProvider>
      <HopDongXaHoiHoaFilterProvider>
        <HopDongXaHoiHoaContainer />
      </HopDongXaHoiHoaFilterProvider>
    </ListHopDongXaHoiHoaProvider>
  );
}
