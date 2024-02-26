import { useMutation, useQuery, useQueryClient } from 'react-query';
import { IDmTinh } from 'src/@types/category';
import { ResponseInfo } from 'src/@types/common';
import { API_ENDPOINTS } from 'src/constants/apiEndpoints';
import { dmTinhClient } from './client/dmTinh';

export const useDmTinhsQuery = (options: any = {}) =>
  useQuery<ResponseInfo<IDmTinh>, Error>(
    [API_ENDPOINTS.DANH_MUC.TINH],
    () => dmTinhClient.all({}),
    {
      keepPreviousData: true,
      ...options,
    }
  );

export const useCreateDmTinhMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(dmTinhClient.create, {
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.DANH_MUC.TINH);
    },
  });
};

export const useUpdateDmTinhMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(dmTinhClient.update, {
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.DANH_MUC.TINH);
    },
  });
};

export const useDeleteDmTinhMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(dmTinhClient.delete, {
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.DANH_MUC.TINH);
    },
  });
};
