import { useQuery } from 'react-query';
import { ActivityLogPaginator, ActivityLogQueryOptions } from 'src/@types/activityLog';
import { API_ENDPOINTS } from 'src/constants/apiEndpoints';
import { activityLogClient } from './client/activityLog';

export const useActivityLogQuery = (
  options: Partial<ActivityLogQueryOptions>,
  useQueryOptions?: any
) => {
  const queryInfo = useQuery<ActivityLogPaginator, Error>(
    [API_ENDPOINTS.ACTIVITY_LOG, options],
    ({ queryKey, pageParam }) =>
      activityLogClient.paginated({ ...(queryKey[1] as Record<string, unknown>), ...pageParam }),
    {
      keepPreviousData: true,
      ...useQueryOptions,
    }
  );

  return {
    ...queryInfo,
  };
};
