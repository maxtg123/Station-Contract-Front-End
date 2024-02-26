import { useMutation, useQuery, useQueryClient } from 'react-query';
import { API_ENDPOINTS } from 'src/constants/apiEndpoints';
import { tienTrinhClient } from './client/tienTrinh';

export const useTienTrinhQuery = (id: number, options: any = {}) =>
  useQuery<any, Error>([API_ENDPOINTS.TIEN_TRINH], () => tienTrinhClient.tienTrinh(id), {
    keepPreviousData: true,
    ...options,
  });

export const useDeleteTienTrinhMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(tienTrinhClient.deleteTienTrinh, {
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.HOP_DONG);
    },
  });
};
