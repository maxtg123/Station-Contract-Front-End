import { useMutation, useQuery, useQueryClient } from 'react-query';
import { IDmPhongDai } from 'src/@types/category';
import { ResponseInfo } from 'src/@types/common';
import { API_ENDPOINTS } from 'src/constants/apiEndpoints';
import { dmPhongDaiClient } from './client/dmPhongDai';

export const useDmPhongDaisQuery = (options: any = {}) =>
  useQuery<ResponseInfo<IDmPhongDai>, Error>(
    [API_ENDPOINTS.DANH_MUC.PHONG_DAI],
    () => dmPhongDaiClient.all({}),
    {
      keepPreviousData: true,
      ...options,
    }
  );

export const useCreateDmPhongDaiMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(dmPhongDaiClient.create, {
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.DANH_MUC.PHONG_DAI);
    },
  });
};

export const useUpdateDmPhongDaiMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(dmPhongDaiClient.update, {
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.DANH_MUC.PHONG_DAI);
    },
  });
};

export const useDeleteDmPhongDaiMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(dmPhongDaiClient.delete, {
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.DANH_MUC.PHONG_DAI);
    },
  });
};
