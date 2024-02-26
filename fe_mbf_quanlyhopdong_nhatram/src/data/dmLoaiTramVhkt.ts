import { useMutation, useQuery, useQueryClient } from 'react-query';
import { IDmLoaiTramVhkt } from 'src/@types/category';
import { ResponseInfo } from 'src/@types/common';
import { API_ENDPOINTS } from 'src/constants/apiEndpoints';
import { dmLoaiTramVhktClient } from './client/dmLoaiTramVhkt';

export const useDmLoaiTramVhktsQuery = (options: any = {}) =>
  useQuery<ResponseInfo<IDmLoaiTramVhkt>, Error>(
    [API_ENDPOINTS.DANH_MUC.LOAI_TRAM_VHKT],
    () => dmLoaiTramVhktClient.all({}),
    {
      keepPreviousData: true,
      ...options,
    }
  );

export const useCreateDmLoaiTramVhktMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(dmLoaiTramVhktClient.create, {
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.DANH_MUC.LOAI_TRAM_VHKT);
    },
  });
};

export const useUpdateDmLoaiTramVhktMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(dmLoaiTramVhktClient.update, {
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.DANH_MUC.LOAI_TRAM_VHKT);
    },
  });
};

export const useDeleteDmLoaiTramVhktMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(dmLoaiTramVhktClient.delete, {
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.DANH_MUC.LOAI_TRAM_VHKT);
    },
  });
};
