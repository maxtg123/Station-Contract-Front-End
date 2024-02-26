import { useMutation, useQuery, useQueryClient } from 'react-query';
import { ResponseInfo } from 'src/@types/common';
import { IHopDong } from 'src/@types/hopdongmatbang';
import {
  IDataExportTram,
  IThongKeTram,
  ITram,
  TramPaginator,
  TramQueryOptions,
} from 'src/@types/tram';
import { API_ENDPOINTS } from 'src/constants/apiEndpoints';
import { tramClient } from './client/tram';

export type IQueryTramParams = {
  size: number;
  page: number;
  search: string;
};

export const useTramsQuery = (options: Partial<TramQueryOptions>, useQueryOptions?: any) => {
  const queryInfo = useQuery<TramPaginator, Error>(
    [API_ENDPOINTS.TRAM, options],
    ({ queryKey, pageParam }) =>
      tramClient.paginated({ ...(queryKey[1] as Record<string, unknown>), ...pageParam }),
    {
      keepPreviousData: true,
      ...useQueryOptions,
    }
  );

  return {
    ...queryInfo,
  };
};

export const useTramQuery = (id: number, options: any = {}) =>
  useQuery<ResponseInfo<ITram>, Error>([API_ENDPOINTS.TRAM, { id }], () => tramClient.get({ id }), {
    enabled: !!id,
    ...options,
  });
export const useListHopDongOfTramQuery = (id: number, options: any = {}) =>
  useQuery<IHopDong[], Error>(
    [API_ENDPOINTS.TRAM, { id }],
    () => tramClient.getListHopDongOfTram(id),
    {
      enabled: !!id,
      ...options,
    }
  );
export const useThongKeTramQuery = (options: any = {}) =>
  useQuery<IThongKeTram, Error>(
    [API_ENDPOINTS.THONG_KE_TRAM],
    () => tramClient.thongKeTram(`${API_ENDPOINTS.THONG_KE_TRAM}`),
    {
      keepPreviousData: true,
      ...options,
    }
  );

export const useCreateTramMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(tramClient.create, {
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.TRAM);
      queryClient.invalidateQueries(API_ENDPOINTS.THONG_KE_TRAM);
    },
  });
};

export const useUpdateTramMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(tramClient.update, {
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.TRAM);
      queryClient.invalidateQueries(API_ENDPOINTS.THONG_KE_TRAM);
    },
  });
};

export const useDeleteTramMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(tramClient.delete, {
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.TRAM);
      queryClient.invalidateQueries(API_ENDPOINTS.THONG_KE_TRAM);
    },
  });
};
export const useExportTramMutation = () =>
  useMutation((data: IDataExportTram) => tramClient.exportExcelTram(API_ENDPOINTS.TRAM, data));

export const useSyncTramFromPTM = () => {
  const queryClient = useQueryClient();
  return useMutation(() => tramClient.syncTramFromPTM(), {
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.TRAM);
    },
  });
};
