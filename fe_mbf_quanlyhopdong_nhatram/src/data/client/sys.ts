import { API_ENDPOINTS } from 'src/constants/apiEndpoints';
import { HttpClient } from 'src/utils/httpClient';

export const sysClient = {
  allModules: () => {
    return HttpClient.get<any>(API_ENDPOINTS.SYS.MODULE);
  },
  allAction: () => {
    return HttpClient.get<any>(API_ENDPOINTS.SYS.ACTION);
  },
};
