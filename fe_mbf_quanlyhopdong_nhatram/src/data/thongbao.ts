import { useMutation, useQuery, useQueryClient } from 'react-query';
import { ThongBaoPaginator, ThongBaoQueryOptions } from 'src/@types/thongbao';
import { API_ENDPOINTS } from 'src/constants/apiEndpoints';
import { thongBaoClient } from './client/thongbao';

export const useThongBaosQuery = (
  options: Partial<ThongBaoQueryOptions>,
  useQueryOptions?: any
) => {
  const queryInfo = useQuery<ThongBaoPaginator, Error>(
    [API_ENDPOINTS.THONG_BAO, options],
    ({ queryKey, pageParam }) =>
      thongBaoClient.paginated({ ...(queryKey[1] as Record<string, unknown>), ...pageParam }),
    {
      keepPreviousData: true,
      ...useQueryOptions,
    }
  );

  return {
    ...queryInfo,
  };
};

export const useTotalThongBaoChuaXemQuery = (options: any) =>
  useQuery<any, Error>([API_ENDPOINTS.THONG_BAO], () => thongBaoClient.totalThongBaoChuaXem(), {
    ...options,
  });

export const useUpdateThongBaoMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(thongBaoClient.update, {
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.THONG_BAO);
    },
  });
};
