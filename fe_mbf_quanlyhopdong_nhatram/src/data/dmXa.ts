import { useMutation, useQuery, useQueryClient } from 'react-query';
import { IDmXa } from 'src/@types/category';
import { ResponseInfo } from 'src/@types/common';
import { API_ENDPOINTS } from 'src/constants/apiEndpoints';
import { dmXaClient } from './client/dmXa';

export const useDmXasQuery = (id: number, options: any = {}) =>
  useQuery<ResponseInfo<IDmXa>, Error>(
    [API_ENDPOINTS.DANH_MUC.XA, id],
    () => dmXaClient.getListToId({ id }),
    {
      keepPreviousData: true,
      ...options,
    }
  );
export const useDmAllXasQuery = (options: any = {}) =>
  useQuery<ResponseInfo<IDmXa>, Error>([API_ENDPOINTS.DANH_MUC.XA], () => dmXaClient.all({}), {
    keepPreviousData: true,
    ...options,
  });
export const useCreateDmXaMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(dmXaClient.create, {
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.DANH_MUC.XA);
    },
  });
};

export const useUpdateDmXaMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(dmXaClient.update, {
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.DANH_MUC.XA);
    },
  });
};

export const useDeleteDmXaMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(dmXaClient.delete, {
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.DANH_MUC.XA);
    },
  });
};
