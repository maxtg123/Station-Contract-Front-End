import { useMutation, useQuery, useQueryClient } from 'react-query';
import { IDmHuyen } from 'src/@types/category';
import { ResponseInfo } from 'src/@types/common';
import { API_ENDPOINTS } from 'src/constants/apiEndpoints';
import { dmHuyenClient } from './client/dmHuyen';

export const useDmHuyensQuery = (id: number, options: any = {}) =>
  useQuery<ResponseInfo<IDmHuyen>, Error>(
    [API_ENDPOINTS.DANH_MUC.HUYEN, id],
    () => dmHuyenClient.getListToId({ id }),
    {
      keepPreviousData: true,
      ...options,
    }
  );
export const useDmAllHuyenQuery = (options: any = {}) =>
  useQuery<ResponseInfo<IDmHuyen>, Error>(
    [API_ENDPOINTS.DANH_MUC.HUYEN],
    () => dmHuyenClient.all({}),
    {
      keepPreviousData: true,
      ...options,
    }
  );

export const useCreateDmHuyenMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(dmHuyenClient.create, {
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.DANH_MUC.HUYEN);
    },
  });
};

export const useUpdateDmHuyenMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(dmHuyenClient.update, {
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.DANH_MUC.HUYEN);
    },
  });
};

export const useDeleteDmHuyenMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(dmHuyenClient.delete, {
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.DANH_MUC.HUYEN);
    },
  });
};
