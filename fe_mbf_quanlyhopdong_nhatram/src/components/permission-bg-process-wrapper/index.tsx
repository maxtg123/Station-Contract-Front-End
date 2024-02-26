import { cloneElement, useEffect, useState } from 'react';
import { IBgProcess } from 'src/@types/process';
import { LOCAL_STORAGE } from 'src/config-global';

type Props = {
  module: string;
  action: string;
  hideWhenBlocked: boolean;
  children: React.ReactElement;
  blockedComponentPropsOverride?: any;
};

const PermissionBgProcessWrapper = ({
  module,
  action,
  hideWhenBlocked = false,
  children,
  blockedComponentPropsOverride = {},
}: Props) => {
  const [isValid, setIsValid] = useState<boolean>(true);

  useEffect(() => {
    function handleChangeStorage() {
      const bgProcessStorage: string | null = localStorage.getItem(LOCAL_STORAGE.BG_PROCESS);
      const currentProcesses: IBgProcess[] = bgProcessStorage
        ? (JSON.parse(bgProcessStorage) as [])
        : [];
      const processing = currentProcesses.find((p) => p.module === module && p.action === action);

      const _isValid = !processing;
      setIsValid((prev) => (prev !== _isValid ? _isValid : prev));
    }

    window.addEventListener('storage', handleChangeStorage, false);
    return () => window.removeEventListener('storage', handleChangeStorage);
  }, [module, action]);

  if (isValid) {
    return children;
  }

  if (!hideWhenBlocked) {
    return cloneElement(children, { ...blockedComponentPropsOverride });
  }
  return null;
};

export default PermissionBgProcessWrapper;
