import { useEffect } from 'react';
// next
import { useRouter } from 'next/router';
// components
import { getAuthCredentials } from 'src/utils/authUtils';
//

// ----------------------------------------------------------------------

type GuestGuardProps = {
  children: React.ReactNode;
};

export default function GuestGuard({ children }: GuestGuardProps) {
  const router = useRouter();

  // const { isAuthenticated, isInitialized } = useAuthContext();
  const { token } = getAuthCredentials();
  const isUser = !!token;
  useEffect(() => {
    if (isUser) {
      router.replace('/dashboard');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUser]);

  // if (isInitialized === isAuthenticated) {
  //   return <LoadingScreen />;
  // }

  return <> {children} </>;
}
