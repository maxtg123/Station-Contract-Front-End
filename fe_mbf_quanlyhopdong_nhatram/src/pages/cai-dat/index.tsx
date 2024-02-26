import { useEffect } from 'react';
import { useRouter } from 'next/router';

// ----------------------------------------------------------------------

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    if (router.pathname === '/cai-dat') {
      router.push('/cai-dat/chu-ky/');
    }
  });

  return null;
}
