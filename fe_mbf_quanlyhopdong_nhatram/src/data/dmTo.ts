import { useMutation, useQuery, useQueryClient } from 'react-query';
import { IDmTo } from 'src/@types/category';
import { ResponseInfo } from 'src/@types/common';
import { API_ENDPOINTS } from 'src/constants/apiEndpoints';
import { dmToClient } from './client/dmTo';

export const useDmTosQuery = (options: any = {}) =>
  useQuery<ResponseInfo<IDmTo>, Error>([API_ENDPOINTS.DANH_MUC.TO], () => dmToClient.all({}), {
    keepPreviousData: true,
    ...options,
  });

export const useCreateDmToMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(dmToClient.create, {
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.DANH_MUC.TO);
    },
  });
};

export const useUpdateDmToMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(dmToClient.update, {
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.DANH_MUC.TO);
    },
  });
};

export const useDeleteDmToMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(dmToClient.delete, {
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.DANH_MUC.TO);
    },
  });
};
