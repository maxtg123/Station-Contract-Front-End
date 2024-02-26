import { useRouter } from 'next/router';
import { cloneElement, useEffect, useState } from 'react';
import { IAction, IModule } from 'src/@types/chucvu';
import useAuthCredentials from 'src/hooks/useAuthCredentials';
import { PATH_PAGE } from 'src/routes/paths';

type Props = {
  module: IModule;
  action: IAction | 'all';
  hideWhenBlocked: boolean;
  children: React.ReactElement;
  blockedComponentPropsOverride?: any;
  checkAt: 'allPD' | 'atLeastPD' | 'pdChinh';
  redirectTo403?: boolean;
  isActive?: boolean;
};

const PermissionWrapper = ({
  module,
  action,
  hideWhenBlocked = false,
  children,
  blockedComponentPropsOverride = {},
  checkAt = 'pdChinh',
  redirectTo403 = false,
  isActive = false,
}: Props) => {
  const router = useRouter();

  const [isValid, setIsValid] = useState<boolean>(false);

  const { listPhanQuyenChinh, allQuyen, isAdmin } = useAuthCredentials();

  useEffect(() => {
    if (isAdmin) {
      setIsValid(true);
      return;
    }
    let _isValid = false;
    if (checkAt === 'pdChinh') {
      _isValid =
        action === 'all'
          ? !!listPhanQuyenChinh.find((q) => q.module === module)
          : !!listPhanQuyenChinh.find((q) => q.module === module && q.action === action);
      setIsValid(_isValid);
      if (!_isValid && isActive) {
        router.push(PATH_PAGE.page403);
      }
      return;
    }

    if (checkAt === 'allPD') {
      _isValid =
        allQuyen.length ===
        allQuyen.filter((kv) =>
          action === 'all'
            ? !!kv?.listQuyen?.find((q) => q.module === module)
            : !!kv?.listQuyen?.find((q) => q.module === module && q.action === action)
        ).length;
      setIsValid(_isValid);
      if (!_isValid && isActive) {
        router.push(PATH_PAGE.page403);
      }
      return;
    }

    if (checkAt === 'atLeastPD') {
      _isValid =
        allQuyen.filter((kv) =>
          action === 'all'
            ? !!kv?.listQuyen?.find((q) => q.module === module)
            : !!kv?.listQuyen?.find((q) => q.module === module && q.action === action)
        ).length > 0;
      setIsValid(_isValid);
      if (!_isValid && isActive) {
        router.push(PATH_PAGE.page403);
      }
    }
  }, [module, action, listPhanQuyenChinh, allQuyen, checkAt, router, isAdmin, isActive]);

  if (isValid) {
    return children;
  }

  if (!hideWhenBlocked) {
    return cloneElement(children, { ...blockedComponentPropsOverride });
  }
  return null;
};

export default PermissionWrapper;
