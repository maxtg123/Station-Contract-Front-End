import { useMutation, useQuery, useQueryClient } from 'react-query';
import { IDmLoaiCsht } from 'src/@types/category';
import { ResponseInfo } from 'src/@types/common';
import { API_ENDPOINTS } from 'src/constants/apiEndpoints';
import { dmLoaiCshtClient } from './client/dmLoaiCsht';

export const useDmLoaiCshtsQuery = (options: any = {}) =>
  useQuery<ResponseInfo<IDmLoaiCsht>, Error>(
    [API_ENDPOINTS.DANH_MUC.LOAI_CSHT],
    () => dmLoaiCshtClient.all({}),
    {
      keepPreviousData: true,
      ...options,
    }
  );

export const useCreateDmLoaiCshtMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(dmLoaiCshtClient.create, {
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.DANH_MUC.LOAI_CSHT);
    },
  });
};

export const useUpdateDmLoaiCshtMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(dmLoaiCshtClient.update, {
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.DANH_MUC.LOAI_CSHT);
    },
  });
};

export const useDeleteDmLoaiCshtMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(dmLoaiCshtClient.delete, {
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.DANH_MUC.LOAI_CSHT);
    },
  });
};
