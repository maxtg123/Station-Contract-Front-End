import { useMutation, useQuery, useQueryClient } from 'react-query';
import { IDmLoaiThietBiRan } from 'src/@types/category';
import { ResponseInfo } from 'src/@types/common';
import { API_ENDPOINTS } from 'src/constants/apiEndpoints';
import { dmLoaiThietBiRanClient } from './client/dmLoaiThietBiRan';

export const useDmLoaiThietBiRansQuery = (options: any = {}) =>
  useQuery<ResponseInfo<IDmLoaiThietBiRan>, Error>(
    [API_ENDPOINTS.DANH_MUC.LOAI_THIET_BI_RAN],
    () => dmLoaiThietBiRanClient.all({}),
    {
      keepPreviousData: true,
      ...options,
    }
  );

export const useCreateDmLoaiThietBiRanMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(dmLoaiThietBiRanClient.create, {
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.DANH_MUC.LOAI_THIET_BI_RAN);
    },
  });
};

export const useUpdateDmLoaiThietBiRanMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(dmLoaiThietBiRanClient.update, {
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.DANH_MUC.LOAI_THIET_BI_RAN);
    },
  });
};

export const useDeleteDmLoaiThietBiRanMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(dmLoaiThietBiRanClient.delete, {
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.DANH_MUC.LOAI_THIET_BI_RAN);
    },
  });
};
