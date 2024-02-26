import { useMutation } from 'react-query';
import { userClient } from './client/user';

export function useLogin() {
  return useMutation(userClient.login);
}
