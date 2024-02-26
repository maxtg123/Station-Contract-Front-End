import { useMutation, useQuery, useQueryClient } from 'react-query';
import { IDmDonViDungChung } from 'src/@types/category';
import { ResponseInfo } from 'src/@types/common';
import { API_ENDPOINTS } from 'src/constants/apiEndpoints';
import { dmDonViDungChungClient } from './client/dmDonViDungChung';

export const useDmDonViDungChungQuery = (options: any = {}) =>
  useQuery<ResponseInfo<IDmDonViDungChung>, Error>(
    [API_ENDPOINTS.DANH_MUC.DON_VI_DUNG_CHUNG],
    () => dmDonViDungChungClient.all({}),
    {
      keepPreviousData: true,
      ...options,
    }
  );

export const useCreateDmDonViDungChungMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(dmDonViDungChungClient.create, {
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.DANH_MUC.DON_VI_DUNG_CHUNG);
    },
  });
};

export const useUpdateDmDonViDungChungMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(dmDonViDungChungClient.update, {
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.DANH_MUC.DON_VI_DUNG_CHUNG);
    },
  });
};

export const useDeleteDmDonViDungChungMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(dmDonViDungChungClient.delete, {
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.DANH_MUC.DON_VI_DUNG_CHUNG);
    },
  });
};
