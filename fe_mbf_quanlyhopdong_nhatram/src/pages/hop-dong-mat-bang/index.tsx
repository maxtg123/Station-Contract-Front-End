import { useEffect } from 'react';
import { useRouter } from 'next/router';

// ----------------------------------------------------------------------

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    if (router.pathname === '/hop-dong-mat-bang') {
      router.push('/hop-dong-mat-bang/danh-sach/');
    }
  });

  return null;
}
