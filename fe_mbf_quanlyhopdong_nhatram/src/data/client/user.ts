import { IAuthResponse, ILoginInput } from 'src/@types/user';
import { API_ENDPOINTS } from 'src/constants/apiEndpoints';
import { HttpClient } from 'src/utils/httpClient';

export const userClient = {
  login: (variables: ILoginInput) => {
    return HttpClient.post<IAuthResponse>(API_ENDPOINTS.LOGIN, variables);
  },
};
