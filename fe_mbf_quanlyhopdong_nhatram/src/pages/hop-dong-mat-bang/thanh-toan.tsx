import { HopDongFilterProvider } from 'src/context/hop-dong-mat-bang/hopDongFilterContext';
import DashboardLayout from 'src/layouts/dashboard/DashboardLayout';
import ThanhToanContainer from 'src/sections/hopdongmatbang/thanhtoan/ThanhToanContainer';
// ----------------------------------------------------------------------
ThanhToanPage.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

export default function ThanhToanPage() {
  return (
    <HopDongFilterProvider>
      <ThanhToanContainer />
    </HopDongFilterProvider>
  );
}
