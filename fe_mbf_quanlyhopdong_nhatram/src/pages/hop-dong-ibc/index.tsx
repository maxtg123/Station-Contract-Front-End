import { useEffect } from 'react';
import { useRouter } from 'next/router';

// ----------------------------------------------------------------------

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    if (router.pathname === '/hop-dong-ibc') {
      router.push('/hop-dong-ibc/danh-sach/');
    }
  });

  return null;
}
