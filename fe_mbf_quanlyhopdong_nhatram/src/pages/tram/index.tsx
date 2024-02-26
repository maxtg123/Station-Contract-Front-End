import { TramFilterProvider } from 'src/context/tram/tramFilterContext';
import DashboardLayout from 'src/layouts/dashboard/DashboardLayout';
import TramContainer from 'src/sections/tram/TramContainer';

TramPage.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function TramPage() {
  return (
    <TramFilterProvider>
      <TramContainer />
    </TramFilterProvider>
  );
}
