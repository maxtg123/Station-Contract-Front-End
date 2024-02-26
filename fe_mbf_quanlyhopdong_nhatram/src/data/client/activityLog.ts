import { IActivityLog, ActivityLogQueryOptions, ActivityLogPaginator } from 'src/@types/activityLog';
import { API_ENDPOINTS } from 'src/constants/apiEndpoints';
import { HttpClient } from 'src/utils/httpClient';
import { crudFactory } from './curdFactory';

export const activityLogClient = {
  ...crudFactory<IActivityLog, any, any>(API_ENDPOINTS.ACTIVITY_LOG),
  paginated: ({ ...params }: Partial<ActivityLogQueryOptions>) =>
    HttpClient.get<ActivityLogPaginator>(API_ENDPOINTS.ACTIVITY_LOG, {
      ...params,
    }),
};
