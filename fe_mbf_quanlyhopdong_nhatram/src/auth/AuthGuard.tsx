// next
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import LoadingScreen from 'src/components/loading-screen/LoadingScreen';
import { PATH_AUTH } from 'src/routes/paths';
import { getAuthCredentials } from 'src/utils/authUtils';
// components
//

// ----------------------------------------------------------------------

type AuthGuardProps = {
  children: React.ReactNode;
};

export default function AuthGuard({ children }: AuthGuardProps) {
  // const router = useRouter();

  const { token } = getAuthCredentials();
  const isUser = !!token;

  // useEffect(() => {
  //   if (!isUser) router.replace(PATH_AUTH.login); // If not authenticated, force log in
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isUser]);

  return <ClientOnly>{isUser ? <>{children}</> : <LoadingScreen />}</ClientOnly>;
}

function ClientOnly({ children }: { children: React.ReactElement }) {
  const router = useRouter();

  const { token } = getAuthCredentials();
  const isUser = !!token;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isUser && mounted) router.replace(PATH_AUTH.login); // If not authenticated, force log in
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUser]);

  if (!mounted) return null;

  return children;
}
