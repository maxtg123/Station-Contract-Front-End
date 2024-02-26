import { useRouter } from 'next/router';
import { useEffect } from 'react';

// ----------------------------------------------------------------------

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    if (router.pathname === '/danh-muc') {
      router.push('/danh-muc/loai-csht');
    }
  });

  return null;
}
