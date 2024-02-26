import { useMutation, useQuery, useQueryClient } from 'react-query';
import { IDmLoaiCotAnten } from 'src/@types/category';
import { ResponseInfo } from 'src/@types/common';
import { API_ENDPOINTS } from 'src/constants/apiEndpoints';
import { dmLoaiCotAntenClient } from './client/dmLoaiCotAnten';

export const useDmLoaiCotAntensQuery = (options: any = {}) =>
  useQuery<ResponseInfo<IDmLoaiCotAnten>, Error>(
    [API_ENDPOINTS.DANH_MUC.LOAI_COT_ANTEN],
    () => dmLoaiCotAntenClient.all({}),
    {
      keepPreviousData: true,
      ...options,
    }
  );

export const useCreateDmLoaiCotAntenMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(dmLoaiCotAntenClient.create, {
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.DANH_MUC.LOAI_COT_ANTEN);
    },
  });
};

export const useUpdateDmLoaiCotAntenMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(dmLoaiCotAntenClient.update, {
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.DANH_MUC.LOAI_COT_ANTEN);
    },
  });
};

export const useDeleteDmLoaiCotAntenMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(dmLoaiCotAntenClient.delete, {
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.DANH_MUC.LOAI_COT_ANTEN);
    },
  });
};
