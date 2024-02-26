import { useMutation, useQuery, useQueryClient } from 'react-query';
import { IDmLoaiPhongMay } from 'src/@types/category';
import { ResponseInfo } from 'src/@types/common';
import { API_ENDPOINTS } from 'src/constants/apiEndpoints';
import { dmLoaiPhongMayClient } from './client/dmLoaiPhongMay';

export const useDmLoaiPhongMaysQuery = (options: any = {}) =>
  useQuery<ResponseInfo<IDmLoaiPhongMay>, Error>(
    [API_ENDPOINTS.DANH_MUC.LOAI_PHONG_MAY],
    () => dmLoaiPhongMayClient.all({}),
    {
      keepPreviousData: true,
      ...options,
    }
  );

export const useCreateDmLoaiPhongMayMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(dmLoaiPhongMayClient.create, {
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.DANH_MUC.LOAI_PHONG_MAY);
    },
  });
};

export const useUpdateDmLoaiPhongMayMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(dmLoaiPhongMayClient.update, {
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.DANH_MUC.LOAI_PHONG_MAY);
    },
  });
};

export const useDeleteDmLoaiPhongMayMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(dmLoaiPhongMayClient.delete, {
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.DANH_MUC.LOAI_PHONG_MAY);
    },
  });
};
