import { useMutation, useQuery, useQueryClient } from 'react-query';
import { IDmDoiTuongKyHopDong } from 'src/@types/category';
import { ResponseInfo } from 'src/@types/common';
import { API_ENDPOINTS } from 'src/constants/apiEndpoints';
import { dmDoiTuongKyHopDongClient } from './client/dmDoiTuongKyHopDong';

export const useDmDoiTuongKyHopDongsQuery = (options: any = {}) =>
  useQuery<ResponseInfo<IDmDoiTuongKyHopDong>, Error>(
    [API_ENDPOINTS.DANH_MUC.DOI_TUONG_KY_HOP_DONG],
    () => dmDoiTuongKyHopDongClient.all({}),
    {
      keepPreviousData: true,
      ...options,
    }
  );

export const useCreateDmDoiTuongKyHopDongMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(dmDoiTuongKyHopDongClient.create, {
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.DANH_MUC.DOI_TUONG_KY_HOP_DONG);
    },
  });
};

export const useUpdateDmDoiTuongKyHopDongMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(dmDoiTuongKyHopDongClient.update, {
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.DANH_MUC.DOI_TUONG_KY_HOP_DONG);
    },
  });
};

export const useDeleteDmDoiTuongKyHopDongMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(dmDoiTuongKyHopDongClient.delete, {
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.DANH_MUC.DOI_TUONG_KY_HOP_DONG);
    },
  });
};
