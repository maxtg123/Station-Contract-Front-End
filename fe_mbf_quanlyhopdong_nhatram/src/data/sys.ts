import { useQuery } from 'react-query';
import { API_ENDPOINTS } from 'src/constants/apiEndpoints';
import { sysClient } from './client/sys';

export function useSysModulesQuery(options: any) {
  return useQuery<any, Error>([API_ENDPOINTS.SYS.MODULE], () => sysClient.allModules(), {
    ...options,
  });
}

export function useSysActionsQuery(options: any) {
  return useQuery<any, Error>([API_ENDPOINTS.SYS.ACTION], () => sysClient.allAction(), {
    ...options,
  });
}
