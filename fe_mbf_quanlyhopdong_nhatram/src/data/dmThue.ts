import { useMutation, useQuery, useQueryClient } from 'react-query';
import { IDmThue } from 'src/@types/category';
import { ResponseInfo } from 'src/@types/common';
import { API_ENDPOINTS } from 'src/constants/apiEndpoints';
import { dmThueClient } from './client/dmThue';

export const useDmThuesQuery = (options: any = {}) =>
  useQuery<ResponseInfo<IDmThue>, Error>(
    [API_ENDPOINTS.DANH_MUC.THUE],
    () => dmThueClient.all({}),
    {
      keepPreviousData: true,
      ...options,
    }
  );

export const useCreateDmThueMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(dmThueClient.create, {
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.DANH_MUC.THUE);
    },
  });
};

export const useUpdateDmThueMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(dmThueClient.update, {
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.DANH_MUC.THUE);
    },
  });
};

export const useDeleteDmThueMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(dmThueClient.delete, {
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.DANH_MUC.THUE);
    },
  });
};
