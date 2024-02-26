import { useMutation, useQuery, useQueryClient } from 'react-query';
import { IDmLoaiHangMucCsht } from 'src/@types/category';
import { ResponseInfo } from 'src/@types/common';
import { API_ENDPOINTS } from 'src/constants/apiEndpoints';
import { dmLoaiHangMucCshtClient } from './client/dmLoaiHangMucCsht';

export const useDmLoaiHangMucCshtsQuery = (options: any = {}) =>
  useQuery<ResponseInfo<IDmLoaiHangMucCsht>, Error>(
    [API_ENDPOINTS.DANH_MUC.LOAI_HANG_MUC_CSHT],
    () => dmLoaiHangMucCshtClient.all({}),
    {
      keepPreviousData: true,
      ...options,
    }
  );

export const useCreateDmLoaiHangMucCshtMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(dmLoaiHangMucCshtClient.create, {
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.DANH_MUC.LOAI_HANG_MUC_CSHT);
    },
  });
};

export const useUpdateDmLoaiHangMucCshtMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(dmLoaiHangMucCshtClient.update, {
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.DANH_MUC.LOAI_HANG_MUC_CSHT);
    },
  });
};

export const useDeleteDmLoaiHangMucCshtMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(dmLoaiHangMucCshtClient.delete, {
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.DANH_MUC.LOAI_HANG_MUC_CSHT);
    },
  });
};
