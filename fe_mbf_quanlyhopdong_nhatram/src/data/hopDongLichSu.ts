import { useQuery } from 'react-query';
import { HopDongLichSuPaginator, HopDongLichSuQueryOptions } from 'src/@types/hopDongLichSu';
import { API_ENDPOINTS } from 'src/constants/apiEndpoints';
import { hopDongLichSuClient } from './client/hopDongLichSu';

export const useHopDongLichSuQuery = (
  options: Partial<HopDongLichSuQueryOptions>,
  useQueryOptions?: any
) => {
  const queryInfo = useQuery<HopDongLichSuPaginator, Error>(
    [API_ENDPOINTS.HOP_DONG_LICH_SU, options],
    ({ queryKey, pageParam }) =>
      hopDongLichSuClient.paginated({ ...(queryKey[1] as Record<string, unknown>), ...pageParam }),
    {
      keepPreviousData: true,
      ...useQueryOptions,
    }
  );

  return queryInfo;
};
