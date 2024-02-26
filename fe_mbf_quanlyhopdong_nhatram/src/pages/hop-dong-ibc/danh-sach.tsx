import { HopDongIbcFilterProvider } from 'src/context/hop-dong-ibc/hopDongIbcFilterContext';
import { ListHopDongIbcProvider } from 'src/context/hop-dong-ibc/listHopDongIbcContext';
import HopDongIbcContainer from 'src/sections/hopdongibc/HopDongIbcContainer';
import DashboardLayout from '../../layouts/dashboard';
// ----------------------------------------------------------------------

HopDongIbcPage.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function HopDongIbcPage() {
  return (
    <ListHopDongIbcProvider>
      <HopDongIbcFilterProvider>
        <HopDongIbcContainer />
      </HopDongIbcFilterProvider>
    </ListHopDongIbcProvider>
  );
}
