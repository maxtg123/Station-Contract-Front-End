import { useMutation, useQuery, useQueryClient } from 'react-query';
import { IDmLoaiTram } from 'src/@types/category';
import { ResponseInfo } from 'src/@types/common';
import { API_ENDPOINTS } from 'src/constants/apiEndpoints';
import { dmLoaiTramClient } from './client/dmLoaiTram';

export const useDmLoaiTramsQuery = (options: any = {}) =>
  useQuery<ResponseInfo<IDmLoaiTram>, Error>(
    [API_ENDPOINTS.DANH_MUC.LOAI_TRAM],
    () => dmLoaiTramClient.all({}),
    {
      keepPreviousData: true,
      ...options,
    }
  );

export const useCreateDmLoaiTramMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(dmLoaiTramClient.create, {
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.DANH_MUC.LOAI_TRAM);
    },
  });
};

export const useUpdateDmLoaiTramMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(dmLoaiTramClient.update, {
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.DANH_MUC.LOAI_TRAM);
    },
  });
};

export const useDeleteDmLoaiTramMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(dmLoaiTramClient.delete, {
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.DANH_MUC.LOAI_TRAM);
    },
  });
};
