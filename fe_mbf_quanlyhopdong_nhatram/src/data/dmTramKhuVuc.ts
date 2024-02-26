import { useMutation, useQuery, useQueryClient } from 'react-query';
import { IDmTramKhuVuc } from 'src/@types/category';
import { ResponseInfo } from 'src/@types/common';
import { API_ENDPOINTS } from 'src/constants/apiEndpoints';
import { dmTramKhuVucClient } from './client/dmTramKhuVuc';

export const useDmTramKhuVucsQuery = (options: any = {}) =>
  useQuery<ResponseInfo<IDmTramKhuVuc>, Error>(
    [API_ENDPOINTS.DANH_MUC.TRAM_KHU_VUC],
    () => dmTramKhuVucClient.all({}),
    {
      keepPreviousData: true,
      ...options,
    }
  );

export const useCreateDmTramKhuVucMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(dmTramKhuVucClient.create, {
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.DANH_MUC.TRAM_KHU_VUC);
    },
  });
};

export const useUpdateDmTramKhuVucMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(dmTramKhuVucClient.update, {
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.DANH_MUC.TRAM_KHU_VUC);
    },
  });
};

export const useDeleteDmTramKhuVucMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(dmTramKhuVucClient.delete, {
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.DANH_MUC.TRAM_KHU_VUC);
    },
  });
};
