import { useMutation, useQuery, useQueryClient } from 'react-query';
import { IDmHinhThucKyHopDong } from 'src/@types/category';
import { ResponseInfo } from 'src/@types/common';
import { API_ENDPOINTS } from 'src/constants/apiEndpoints';
import { dmHinhThucKyHopDongClient } from './client/dmHinhThucKyHopDong';

export const useDmHinhThucKyHopDongsQuery = (options: any = {}) =>
  useQuery<ResponseInfo<IDmHinhThucKyHopDong>, Error>(
    [API_ENDPOINTS.DANH_MUC.HINH_THUC_KY_HOP_DONG],
    () => dmHinhThucKyHopDongClient.all({}),
    {
      keepPreviousData: true,
      ...options,
    }
  );

export const useCreateDmHinhThucKyHopDongMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(dmHinhThucKyHopDongClient.create, {
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.DANH_MUC.HINH_THUC_KY_HOP_DONG);
    },
  });
};

export const useUpdateDmHinhThucKyHopDongMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(dmHinhThucKyHopDongClient.update, {
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.DANH_MUC.HINH_THUC_KY_HOP_DONG);
    },
  });
};

export const useDeleteDmHinhThucKyHopDongMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(dmHinhThucKyHopDongClient.delete, {
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.DANH_MUC.HINH_THUC_KY_HOP_DONG);
    },
  });
};
