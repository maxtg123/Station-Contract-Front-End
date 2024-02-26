import { useEffect } from 'react';
import { useRouter } from 'next/router';

// ----------------------------------------------------------------------

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    if (router.pathname === '/hop-dong-xa-hoi-hoa') {
      router.push('/hop-dong-xa-hoi-hoa/danh-sach/');
    }
  });

  return null;
}
